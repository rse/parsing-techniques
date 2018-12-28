
NPM     = npm
NODE    = npx babel-node --presets @babel/preset-env
VARIANT =

VARIANTS = \
	0-re \
	1-sm \
	2-sm-ast \
	3-ls-rdp-ast \
	4-pc-ast \
	5-peg-ast

all: bootstrap $(VARIANTS)

bootstrap:
	@if [ ! -d node_modules ]; then  \
	    echo "++ installing required third-party modules (top-level)"; \
	    $(NPM) install; \
	fi; \
	for variant in $(VARIANTS); do \
	    if [ -f "cfg2kv-$$variant/package.json" -a ! -d "cfg2kv-$$variant/node_modules" ]; then \
	        echo "++ installing required third-party modules (cfg2kv-$$variant)"; \
	        (cd cfg2kv-$$variant && $(NPM) install); \
	    fi; \
	done

cfg2kv:
	@$(NODE) cfg2kv.js $(VARIANT)

0-re:
	@$(MAKE) $(MFLAGS) cfg2kv VARIANT=$@
1-sm:
	@$(MAKE) $(MFLAGS) cfg2kv VARIANT=$@
2-sm-ast:
	@$(MAKE) $(MFLAGS) cfg2kv VARIANT=$@
3-ls-rdp-ast:
	@$(MAKE) $(MFLAGS) cfg2kv VARIANT=$@
4-pc-ast:
	@$(MAKE) $(MFLAGS) cfg2kv VARIANT=$@
5-peg-ast:
	@$(MAKE) $(MFLAGS) cfg2kv VARIANT=$@

clean:
	-rm -rf node_modules
	-rm -rf cfg2kv-*/node_modules

