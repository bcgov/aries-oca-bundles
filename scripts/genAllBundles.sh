#!/bin/bash

# Initialize some variables. Output is always OCABundle.json
ROOTDIR=${PWD}
PARSER=$(which parser)
JQ=$(which jq)
OCABundlesIndex=${PWD}/ocabundles.json
STATUS=0

if [[ ! -f ${OCABundlesIndex} ]]; then
  echo No OCA Bundles Index found in the current folder -- are in the right place?
  show_help
  exit 1
fi

if [[ ! -x "${PARSER}" ]]; then
    echo ERROR: Unable to find the OCA Excel Parser in the designated location.
    show_help
    exit 1
fi

PARSERVER=$(${PARSER} --version | grep "XLS(X) Parser")

if [ "${PARSERVER}" == "" ]; then
    echo ERROR: Wrong type of \"parser\" executable.
    show_help
    exit 1
fi

if [[ ! -x "${JQ}" ]]; then
    echo ERROR: Unable to find the JQ \(JSON Query\) executable.
    show_help
    exit 1
fi


# Usage info
show_help() {
cat << EOF
Usage: ${0##*/}
Generate all of the OCA Bundles from in the repo, based on the Excel file and optionally add
zero or more JSON OCA overlays.

Running this script requires access to the OCA Excel Parser executable,
and the JQ (JSON Query) executable. See the instructions in the README
for details on how to install them.    
EOF
}

genBundle() {
    EXCEL=$(ls *.xlsx 2> /dev/null)
    JSONFiles=$(ls *.json 2> /dev/null)
    OCABUNDLE=NewOCABundle.json
    TMPOCABUNDLE=${OCABUNDLE}.tmp
    FOLDER=$(echo ${PWD} | sed -e "s#${ROOTDIR}/##")
    SHASUM=$(grep ${FOLDER} /${OCABundlesIndex} | head -q -n 1 | sed -e "s/.*sha256\": \"//" -e "s/\".*//")
    # Search the OCA Bundles index for this folder; keep only 1 instance; remove up to the SHA256 value; remove the trailing text

    # Find the one Excel file -- error if less or more
    # Parse the file using the OCA Parser and then prettify the JSON with jq
    if [ "$(echo ${EXCEL} | wc -w )" != "1" ]; then
       echo Bundle ${FOLDER} has $(echo ${EXCEL} | wc -w ) Excel files. Must have exactly one.
       STATUS=1
       return
    fi

    ${PARSER} parse oca --path ${EXCEL} | jq . > ${OCABUNDLE}

    # Grab out from the OCABundle the capture_base item from an overlay so it can be put into the JSON Files
    # The data value may change so grabbing this ensures the added overlays reference the right capture base
    CAPTUREBASEITEM=$(grep -m 1 '"capture_base": "' ${OCABUNDLE} )

    # For each JSON File (if any)
    for file in ${JSONFiles}; do
        if [ "$(echo $file | grep OCABundle | wc -w)" != 0 ]; then
          break
        fi
        BCKFILE=$(basename ${file}).bck
        # Replace the existing "capture_base" JSON item with one from the Excel OCA output
        # and remove the outer array, if present.
        sed -e "s#.*capture_base.:.*#${CAPTUREBASEITEM}#" \
        -e '1,1 s/\[//' \
        -e '$,$ s/]//' ${file} >${BCKFILE}
        grep capture_base ${BCKFILE}
        # Add the overlay to the generated OCA Bundle and out to a temp file
        ${JQ} --slurpfile filejson ${BCKFILE} ".[].overlays += \$filejson" ${OCABUNDLE} > ${TMPOCABUNDLE}
        rm ${BCKFILE}
        # Move the tmp file to be the new(est) OCA Bundle file
        mv ${TMPOCABUNDLE} ${OCABUNDLE}
    done
    NEW_SHASUM=$(shasum -a256 -U ${OCABUNDLE} | sed "s/ .*//")
    if [ "${SHASUM}" == "${NEW_SHASUM}" ]; then
       echo OCA Bundle in ${FOLDER} unchanged -- ${NEW_SHASUM}, ${SHASUM}
    else
       echo OCA Bundle in ${FOLDER} changed ---------------- ${NEW_SHASUM}, ${SHASUM}
       diff OCABundle.json ${OCABUNDLE}
    fi
    rm ${OCABUNDLE}
    return
}

processFolder() {
    # Check for an OCABundle README to decide on processing
    if [ -f README.md ] && grep -q '| Identifier' README.md; then
      genBundle
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

# Start in the OCABundles folder
cd OCABundles

# Recursively process the folders
processFolder
cd ..
exit $STATUS
