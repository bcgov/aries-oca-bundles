#!/bin/bash

if [ "$1" == "mkdocs" ]; then
  # Generating the mkdocs site
  GENMKDOCS=true
fi

OCAIDSJSON=${PWD}/ocabundles.json
OCALISTJSON=${PWD}/ocabundleslist.json
MKDOCSYML=${PWD}/mkdocs.yml
TMPFILE=${PWD}/tmpfile.json
ROOTDIR=${PWD}

# Usage info
show_help() {
cat << EOF
Usage: gen_ocabundlesjson.sh [mkdocs]

Starting from the OCABundles folder in the current folder, and recurse through
all the folders below. For each OCA Bundle found -- identified by the existance
of a README.md file and an OCABundles.json file -- add the information about the
Bundle to the "ocabundles.json" and "ocabundleslist.json" files. If the parameter
"mkdocs" is passed in, also generate a navigation path for the bundles in the
repo "mkdocs.yml" file.

The two JSON files are generated in the current folder. In doing so, an appropriate
JSON header is put into the two files, the trailing comma is removed from the last
entry of each file, and an appropriate footer is put into the two files.

In the mkdocs.yml file, the current navigation is removed from the existing mkdocs.yml,
and the latest version generated in its place.

Each entry in the JSON files contains a "universal" SHA256 hash of the OCA Bundle
including, generated using the "shasum" utility with the options "-a256 -U".

The script exits with an error if the OCABundles folder is not in the current
folder.

EOF
}

# Have to be sure we're in the root folder of the repository
thisDir=${PWD}
if [ ! -d "OCABundles" ]; then
    echo ERROR: There is no OCABundles folder. This script must be run from the root of the repository.
    echo ERROR: Current directory is: ${thisDir}
    show_help
    exit 1
fi

# In a folder with an OCABundle, process the file, and add the data for the bundle into the JSON files
processBundle() {
    BUNDLE_PATH=OCABundle.json
    SHASUM=$(shasum -a256 -U $BUNDLE_PATH | sed "s/ .*//")
    ID=$(grep '^| ' README.md | sed -e "/OCA Bundle/,100d" -e "/Identifier/d" -e "/----/d" -e 's/^| \([^|]*\) |.*/\1/' -e 's/\s*$//' -e 's/ /~/g')
    ORG=$(grep "Publishing\|Issuing" README.md | sed -e "s/.*: //")
    NAME=$(sed -e "2,1000d" -e "s/# //" README.md)
    DESC=$(sed -e "1,2d" -e "/## Identifiers/,1000d" -e "/^\s*$/d" -e "/^- /d" -e 's/[][]//g' -e 's/(.*)//g' -e 's/"/\\"/g' README.md)
    TYPE="schema"
    if [ "$(echo ${PWD} | grep "schema")" == "" ]; then
        TYPE="credential"
    fi
    for id in ${ID}; do
        processed_id=$(echo -n ${id} | sed "s/~/ /g")
        echo "   \"${processed_id}\": { \"path\": \"${RELPATH}/${BUNDLE_PATH}\", \"sha256\": \"${SHASUM}\" }," >>${OCAIDSJSON}
        echo "{ \"id\": \"${processed_id}\", \"org\": \"${ORG}\", \"name\": \"${NAME}\", \"desc\": \"${DESC}\", \"type\": \"${TYPE}\", \"ocabundle\": \"${RELPATH}/${BUNDLE_PATH}\", \"shasum\": \"${SHASUM}\" }," >>${OCALISTJSON}
    done
}

insertBundleiframe () {
    for id in ${ID}; do
      # Do nothing, but $id will be set to the last one...use it
      echo -n ""
    done
    encoded_id=$(echo -n ${id} | sed "s/~/ /g" | jq -sRr @uri)
    # We're scanning the real OCABundles file, but want to update the copied files in the docs folder
    FILE=${thisDir}/docs/$RELPATH/README.md
    sed -e "/## Authorization/i## Credential Appearance\n\n\\<iframe src=\\"https://bcgov.github.io/aries-oca-explorer/identifier/${encoded_id}?view=readonly\\" width=\\"100%\\" height=\\"800\\" frameborder=\\"0\\"\\>\\</iframe\\>\n" $FILE >$FILE.tmp
    mv $FILE.tmp $FILE 
}

addNav() {
    # Add entry to MKDocs Navigation
    for ((num = 1; num <= ${INDENT}; num++)); do echo -n "  " >>$MKDOCSYML; done
    if [[ -f OCABundle.json ]]; then
      echo "- ${RELPATH}/README.md" >>$MKDOCSYML
      insertBundleiframe
    else
      echo "- "$(head -1 README.md | sed "s/[#]* //"): >>$MKDOCSYML
    fi
}

# Recursively process the folders
processFolder() {
    INDENT=$((INDENT+1))
    RELPATH=$(echo ${PWD} | sed -e "s#${ROOTDIR}/##")
    # If the right files are in the folder, process it
    if [[ -f README.md && -f OCABundle.json ]]; then
      processBundle README.md OCABundle.json
    fi
    if [[ -n "${GENMKDOCS}" && -f README.md ]]; then
      addNav # Relies on $ID existing from previous processing
    fi
    # Recurse into the directories of the folder
    for dir in *; do
        if [ -d $dir ]; then
            cd $dir
            processFolder
            cd ..
        fi
    done
    INDENT=$((INDENT-1))
}


# Write the headers for the files
echo -e "{" >${OCAIDSJSON}
echo -e "[" >${OCALISTJSON}
if [ "$1" == "mkdocs" ]; then
    echo -e "- OCA Bundles:" >>${MKDOCSYML}
fi

# Start in the OCABundles folder
cd OCABundles

# Recursively process the folders
INDENT=0
processFolder
cd ..

# Remove the trailing "," on the last generated line, so the JSON is properly formed
sed -e '$s/.$//' ${OCAIDSJSON} >$TMPFILE; mv ${TMPFILE} ${OCAIDSJSON}
sed -e '$s/.$//' ${OCALISTJSON} >$TMPFILE; mv ${TMPFILE} ${OCALISTJSON}

# Write the footers for the files
echo -e "}" >>${OCAIDSJSON}
echo -e "]" >>${OCALISTJSON}
