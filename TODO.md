# TODO

- **Replace the custom INI parser (`startos/fileModels/ini-lib.ts`) with a
  standard library.** Upstream switched to `=` separators in 6.5.0 (simplexmq
  #1767). As of 6.5.0:3 our parser reads both `=` and `:` and writes `=`, so
  existing colon-formatted configs convert to `=` on the next merge. Once a
  couple more upstream versions have shipped (i.e. every live install has been
  rewritten to `=`), drop `ini-lib.ts` in favor of a standard INI parser, and
  remove the `:`-acceptance from `parse` at the same time.
