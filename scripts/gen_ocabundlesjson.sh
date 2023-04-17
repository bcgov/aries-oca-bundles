#!/bin/bash

OCAIDSJSON=ocabundles.json
OCALISTJSON=ocabundleslist.json

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

thisDir=${PWD}
if [ ! -d "OCABundles" ]; then
    echo ERROR: There is no OCABundles folder. This script must be run from the root of the repository.
    echo ERROR: Current directory is: ${thisDir}
    show_help
    exit 1
fi

# Write the headers for the files
echo -e "{" >${OCAIDSJSON}
echo -e "[" >${OCALISTJSON}

for i in OCABundles/schema/*; do
    if [ -d "${i}" ]; then
        for j in ${i}/*; do
            BUNDLE_PATH=${j}/OCABundle.json
            ID=$(grep '^| ' ${j}/README.md | sed -e "/OCA Bundle/,100d" -e "/Identifier/d" -e "/----/d" -e 's/^| \([^|]*\) |.*/\1/' -e 's/\s*$//' -e 's/ /~/g')
            for id in ${ID}; do
                echo "\"${id}\": { \"path\": \"${BUNDLE_PATH}\" }," | sed "s/~/ /g" >>${OCAIDSJSON}
            done
            ORG=$(grep "Publishing\|Issuing" ${j}/README.md | sed -e "s/.*: //")
            NAME=$(sed -e "2,1000d" -e "s/# //" ${j}/README.md)
            DESC=$(sed -e "1,2d" -e "/## Identifiers/,1000d" -e "/^\s*$/d" -e "/^- /d" -e 's/[][]//g' -e 's/(.*)//g' -e 's/"/\\"/g' ${j}/README.md)
            TYPE="schema"
            if [ "$(echo ${j} | grep "schema")" == "" ]; then
                TYPE="credential"
            fi
            echo "{ \"org\": \"${ORG}\", \"name\": \"${NAME}\", \"desc\": \"${DESC}\", \"type\": \"${TYPE}\", \"ocabundle\": \"${BUNDLE_PATH}\" }," >>${OCALISTJSON}
        done
    fi
done

echo -e "}" >>${OCAIDSJSON}
echo -e "]" >>${OCALISTJSON}
