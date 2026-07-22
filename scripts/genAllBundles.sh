#!/bin/bash

# Initialize some variables. Output is always OCABundle.json
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTDIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

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

resolve_parser() {
    if [[ -n "${PARSER_BIN}" && -x "${PARSER_BIN}" ]]; then
        echo "${PARSER_BIN}"
        return
    fi

    if command -v parser >/dev/null 2>&1; then
        command -v parser
        return
    fi

    for candidate in "$HOME/bin/parser" "$HOME/.local/bin/parser"; do
        if [[ -x "${candidate}" ]]; then
            echo "${candidate}"
            return
        fi
    done
}

PARSER=$(resolve_parser)
JQ=$(command -v jq || true)
OCABundlesIndex=${ROOTDIR}/ocabundles.json
STATUS=0

if [[ ! -f ${OCABundlesIndex} ]]; then
    echo "No OCA Bundles Index found at ${OCABundlesIndex}."
  show_help
  exit 1
fi

if [[ ! -x "${PARSER}" ]]; then
    echo ERROR: Unable to find the OCA Excel Parser in the designated location.
    show_help
    exit 1
fi

PARSERVER=$(${PARSER} --version 2>/dev/null | grep "XLS(X) Parser")

if [ "${PARSERVER}" == "" ]; then
    echo ERROR: Wrong type of \"parser\" executable.
    echo ERROR: Parser found at ${PARSER}
    show_help
    exit 1
fi

if [[ ! -x "${JQ}" ]]; then
    echo ERROR: Unable to find the JQ \(JSON Query\) executable.
    show_help
    exit 1
fi

genBundle() {
    EXCEL=$(ls *.xlsx 2> /dev/null)
    JSONFiles=$(ls *.json 2> /dev/null)
    OCABUNDLE=NewOCABundle.json
    TMPOCABUNDLE=${OCABUNDLE}.tmp
    FOLDER=$(echo ${PWD} | sed -e "s#${ROOTDIR}/##")
    SHASUM=$(grep "${FOLDER}" "${OCABundlesIndex}" | head -q -n 1 | sed -e "s/.*sha256\": \"//" -e "s/\".*//")
    # Search the OCA Bundles index for this folder; keep only 1 instance; remove up to the SHA256 value; remove the trailing text

     # Find the one Excel file.
     # Zero files are skipped with a warning; multiple files remain an error.
     EXCEL_COUNT=$(echo ${EXCEL} | wc -w)
     if [ "${EXCEL_COUNT}" = "0" ]; then
         echo "WARNING: Bundle ${FOLDER} has no Excel file. Skipping."
         return
     fi
     if [ "${EXCEL_COUNT}" != "1" ]; then
         echo "ERROR: Bundle ${FOLDER} has ${EXCEL_COUNT} Excel files. Must have exactly one."
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
cd "${ROOTDIR}/OCABundles"

# Recursively process the folders
processFolder
cd ..
exit $STATUS
