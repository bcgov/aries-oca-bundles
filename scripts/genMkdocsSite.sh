#!/bin/bash

MKDOCS=mkdocs.yml

if [ "$1" == "clean" ]; then
   # Clean out the updates made in the docs folder by this script
   rm docs/governance/MAINTAINERS.md
   rm docs/governance/LICENSE.md
   rm -rf docs/OCABundles
   rm docs/ocabundles.json
   rm docs/ocabundleslist.json
   sed -e 's/# site_url:/site_url:/' \
       ${MKDOCS} >${MKDOCS}.tmp
   mv ${MKDOCS}.tmp ${MKDOCS}
   exit 0
fi

# This script is for generating the documentation structure from documents in the Aries OCA Bundles repository.
# This script is intended to run from a GitHub Action as part of updating the gh-pages branch and publishing the website
# The process is:
# - Delete the existing content of the /docs folder in this repo, leaving only `docs/assets`
# - Generate the Mkdocs navigation for the site and put it in place of the current mkdocs YML
# - For each folder that will be in the /docs folder of this rep0:
#   - For each file the is to be in the folder within the /docs folder
#     - Either directly copy, or copy with edits applied the source file to the /docs folder
# - Edits are needed to "fix" the links to work when the file is in the new place in the repo
# See the edits below for the types of changes needed. Usually, they are to change absolute
# links in the markdown documents to relative links in this folder, as well as to handle changes
# in where the docs are placed.
# 
# To find broken links:
# - Run mkdocs locally and click on links and images that result in 404s
# - Once you publish the docs, run a "broken link finder" tool to find others
# To find missing documentation files
# - Scan the /tmp folder for all .md files and see if you have them in the /docs folder
#   - a script to compare the list of .md files in /tmp and /docs is planned

# Have to be sure we're in the root folder of the repository
thisDir=${PWD}
if [ ! -d "OCABundles" ]; then
    echo ERROR: There is no OCABundles folder. This script must be run from the root of the repository.
    echo ERROR: Current directory is: ${thisDir}
    show_help
    exit 1
fi

# echo Building pages for the Aries OCA Bundles website

# Copy MD files that need to be in the root folder to the doc folder
sed -e 's#docs/governance/GOVERNANCE.md#../governance/GOVERNANCE.md#' \
    -e 's#docs/contributing/CONTRIBUTING.md#../contributing/CONTRIBUTING.md#' \
    MAINTAINERS.md >docs/governance/MAINTAINERS.md
cp LICENSE docs/governance/LICENSE.md

# Remove the OCA Bundles Navigation from the mkdocs.yml file, and comment out the site url
# The site_url MUST be uncomment again before commiting. Done as part of the "CLEAN" above.
sed -e '/^- OCA Bundles:/,$d' \
    -e 's/site_url:/# site_url:/' \
    ${MKDOCS} >${MKDOCS}.tmp
mv ${MKDOCS}.tmp ${MKDOCS}

# Copy the MD files from the OCABundles folder into a docs/OCABundles folder
rm -rf docs/OCABundles
rsync -qavm --include='*.md' --include='OCABundle.json' -f 'hide,! */' OCABundles docs/

# Execute the JSON file generator and copy the resulting files into the docs folder
./scripts/gen_ocabundlesjson.sh mkdocs
cp ocabundles.json docs/
cp ocabundleslist.json docs/

# Replace (if needed) the OCA Bundles into the docs folder, deleting all but the MD files

exit
