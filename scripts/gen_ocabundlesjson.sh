#!/bin/bash

OCAIDSJSON=${PWD}/ocabundles.json
OCALISTJSON=${PWD}/ocabundleslist.json
TMPFILE=${PWD}/tmpfile.json
ROOTDIR=${PWD}

# Usage info
show_help() {
cat << EOF
Usage: gen_ocabundlesjson.sh

Starting from the OCABundles folder in the current folder, and recurse through
all the folders below. For each OCA Bundle found -- identified by the existance
of a README.md file and an OCABundles.json file -- add the information about the
Bundle to the "ocabundles.json" and "ocabundleslist.json" files. Those two files
are generated in the current folder. The appropriate JSON header is put into the
two files, the last entry of each file does not have a trailing ",", and an
appropriate footer is put into the two files.

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
    RELPATH=$(echo ${PWD} | sed -e "s#${ROOTDIR}/##")
    BUNDLE_PATH=OCABundle.json
    SHASUM=$(shasum -a256 -U $BUNDLE_PATH | sed "s/ .*//")
    ID=$(grep '^| ' README.md | sed -e "/OCA Bundle/,100d" -e "/Identifier/d" -e "/----/d" -e 's/^| \([^|]*\) |.*/\1/' -e 's/\s*$//' -e 's/ /~/g')
    for id in ${ID}; do
        echo "\"${id}\": { \"path\": \"${RELPATH}/${BUNDLE_PATH}\" }," | sed "s/~/ /g" >>${OCAIDSJSON}
        # Use the line below if we want to add a SHA256 item to the JSON list, for checking if the bundle has changed
        # echo "   \"${id}\": { \"path\": \"${RELPATH}/${BUNDLE_PATH}\", \"sha256\": \"${SHASUM}\" }," | sed "s/~/ /g" >>${OCAIDSJSON}
    done
    ORG=$(grep "Publishing\|Issuing" README.md | sed -e "s/.*: //")
    NAME=$(sed -e "2,1000d" -e "s/# //" README.md)
    DESC=$(sed -e "1,2d" -e "/## Identifiers/,1000d" -e "/^\s*$/d" -e "/^- /d" -e 's/[][]//g' -e 's/(.*)//g' -e 's/"/\\"/g' README.md)
    TYPE="schema"
    if [ "$(echo ${PWD} | grep "schema")" == "" ]; then
        TYPE="credential"
    fi
    echo "{ \"org\": \"${ORG}\", \"name\": \"${NAME}\", \"desc\": \"${DESC}\", \"type\": \"${TYPE}\", \"ocabundle\": \"${RELPATH}/${BUNDLE_PATH}\" }," >>${OCALISTJSON}
    # Use the line below if we want to add a SHA256 item to the JSON list, for checking if the bundle has changed
    # echo "{ \"org\": \"${ORG}\", \"name\": \"${NAME}\", \"desc\": \"${DESC}\", \"type\": \"${TYPE}\", \"ocabundle\": \"${RELPATH}/${BUNDLE_PATH}\", \"shasum\": \"${SHASUM}\" }," >>${OCALISTJSON}
}

# Recursively process the folders
processFolder() {
    # If the right files are in the folder, process it
    if [[ -f README.md && -f OCABundle.json ]]; then
      processBundle README.md OCABundle.json
    fi
    # Recurse into the directories of the folder
    for dir in *; do
        if [ -d $dir ]; then
            cd $dir
            processFolder
            cd ..
        fi
    done
}


# Write the headers for the files
echo -e "{" >${OCAIDSJSON}
echo -e "[" >${OCALISTJSON}

# Start in the OCABundles folder
cd OCABundles

# Recursively process the folders
processFolder
cd ..

# Remove the trailing "," on the last generated line, so the JSON is properly formed
sed -e '$s/.$//' ${OCAIDSJSON} >$TMPFILE; mv ${TMPFILE} ${OCAIDSJSON}
sed -e '$s/.$//' ${OCALISTJSON} >$TMPFILE; mv ${TMPFILE} ${OCALISTJSON}

# Write the footers for the files
echo -e "}" >>${OCAIDSJSON}
echo -e "]" >>${OCALISTJSON}
