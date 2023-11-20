#!/bin/bash

# Initialize some variables. Output is always OCABundle.json
EXCEL=""
JSONFiles=""
OCABUNDLE=OCABundle.json
TMPOCABUNDLE=${OCABUNDLE}.tmp

# Usage info
show_help() {
cat << EOF
Usage: ${0##*/} [-h] -x EXCEL [JSON FILES]...
Generate an OCA Bundle from an Excel file and optionally add
zero or more JSON OCA overlays.

    -h          display this help and exit
    -x EXCEL    write the result to OUTFILE instead of standard output.
    JSON FILES  one or more JSON files that are overlays to added to the OCA Bundle.

The output from a successfule run of the script is always a file called "${OCABUNDLE}".

Running this script requires access to the OCA Excel Parser executable,
and the JQ (JSON Query) executable. See the instructions in the README
for details on how to install them.    
EOF
}

# Check to see if the OCA Parser and JQ are available and executable
PARSER=$(which parser)
JQ=$(which jq)

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

# All good -- on to the parsing of the arguments

OPTIND=1
# Resetting OPTIND is necessary if getopts was used previously in the script.
# It is a good idea to make OPTIND local if you process options in a function.

while getopts hx: opt; do
    case $opt in
        h)
            show_help
            exit 0
            ;;
        x)  EXCEL=$OPTARG
            ;;
        *)
            show_help >&2
            exit 1
            ;;
    esac
done
shift "$((OPTIND-1))"   # Discard the options and sentinel --

# Everything that's left in "$@" is a non-option.  In our case, it is the JSON Files to process.
JSONFiles="$@"

# Make sure we've at least got the Excel file to process
if [ "${EXCEL}" == "" ]; then
    echo -e "Error: Excel file is a required parameter\n"
    show_help
    exit 1
fi

# Parse the file using the OCA Parser and then prettify the JSON with jq
${PARSER} parse oca --path ${EXCEL} | jq . > ${OCABUNDLE}

# Grab out from the OCABundle the capture_base item from an overlay so it can be put into the JSON Files
# The data value may change so grabbing this ensures the added overlays reference the right capture base
CAPTUREBASEITEM=$(grep -m 1 '"capture_base": "' ${OCABUNDLE} )

# For each JSON File (if any)
for file in ${JSONFiles}; do
    BCKFILE=$(basename ${file}).bck
    # Replace the existing "capture_base" JSON item with one from the Excel OCA output
    # and remove the outer array, if present.
    sed -e "s#.*capture_base.:.*#${CAPTUREBASEITEM}#" \
      -e '1,1 s/\[//' \
      -e '$,$ s/]//' ${file} >${BCKFILE}
    # Add the overlay to the generated OCA Bundle and out to a temp file
    ${JQ} --slurpfile filejson ${BCKFILE} ".[].overlays += \$filejson" ${OCABUNDLE} > ${TMPOCABUNDLE}
    rm ${BCKFILE}
    # Move the tmp file to be the new(est) OCA Bundle file
    mv ${TMPOCABUNDLE} ${OCABUNDLE}
done
