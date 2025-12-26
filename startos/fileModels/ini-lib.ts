export type IniValue = string | number | boolean | string[]
export type IniInputValue = IniValue | null | undefined
export type IniSection = Record<string, IniValue>
export type IniInputSection = Record<string, IniInputValue>
export type IniData = Record<string, IniValue | IniSection>
export type IniInputData = Record<string, IniInputValue | IniInputSection>

export interface ParseOptions {
  /** Delimiter for list values (default: ",") */
  listDelimiter?: string
  /** If true, keep all values as strings without type conversion */
  rawStrings?: boolean
}

export interface StringifyOptions {
  /** Delimiter for list values (default: ",") */
  listDelimiter?: string
}

/**
 * Parse a string value into its typed equivalent
 */
function parseValue(value: string, options: ParseOptions): IniValue {
  if (options.rawStrings) {
    return value
  }

  const trimmed = value.trim()

  // Boolean
  if (trimmed.toLowerCase() === 'true') return true
  if (trimmed.toLowerCase() === 'false') return false

  // Number (integers and floats, including negatives)
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const num = parseFloat(trimmed)
    if (!isNaN(num)) return num
  }

  // List (contains delimiter)
  const delimiter = options.listDelimiter ?? ','
  if (trimmed.includes(delimiter)) {
    return trimmed.split(delimiter).map((item) => item.trim())
  }

  // Default: string
  return trimmed
}

/**
 * Convert a typed value back to string
 */
function stringifyValue(value: IniValue, options: StringifyOptions): string {
  if (Array.isArray(value)) {
    const delimiter = options.listDelimiter ?? ','
    return value.join(delimiter)
  }
  return String(value)
}

/**
 * Check if a value is a section (nested object) vs a primitive value
 */
function isSection(
  value: IniInputValue | IniInputSection,
): value is IniInputSection {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Parse an INI string that uses `: ` as the key/value separator
 */
export function parse(content: string, options: ParseOptions = {}): IniData {
  const result: IniData = {}
  let currentSection: string | null = null

  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith(';') || trimmed.startsWith('#')) {
      continue
    }

    // Check for section header
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/)
    if (sectionMatch) {
      currentSection = sectionMatch[1]
      result[currentSection] = {}
      continue
    }

    // Parse key: value pairs
    const separatorIndex = trimmed.indexOf(': ')
    if (separatorIndex !== -1) {
      const key = trimmed.slice(0, separatorIndex).trim()
      const rawValue = trimmed.slice(separatorIndex + 2)
      const value = parseValue(rawValue, options)

      if (currentSection) {
        ;(result[currentSection] as IniSection)[key] = value
      } else {
        result[key] = value
      }
    }
  }

  return result
}

/**
 * Stringify an object to INI format using `: ` as the key/value separator
 * Note: null and undefined values are omitted (INI has no native null concept)
 */
export function stringify(
  data: IniInputData,
  options: StringifyOptions = {},
): string {
  const lines: string[] = []

  // First, output top-level key-value pairs (non-sections)
  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue // filters both null and undefined
    if (!isSection(value)) {
      lines.push(`${key}: ${stringifyValue(value, options)}`)
    }
  }

  // Then, output sections
  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue
    if (isSection(value)) {
      const sectionLines: string[] = []
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subValue == null) continue
        sectionLines.push(`${subKey}: ${stringifyValue(subValue, options)}`)
      }
      // Only add section if it has values
      if (sectionLines.length > 0) {
        if (lines.length > 0) {
          lines.push('') // Blank line before section
        }
        lines.push(`[${key}]`)
        lines.push(...sectionLines)
      }
    }
  }

  return lines.join('\n')
}

/**
 * Type guard to check if a value is a section
 */
export { isSection }
