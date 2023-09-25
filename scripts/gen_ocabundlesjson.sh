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

declare -a schema_files
schema_files=(OCABundles/schema/*)
last_schema_idx=$(( ${#schema_files[*]} - 1 ))
curr_schema_idx=0
for i in OCABundles/schema/*; do
    last_schema=false
    if [[ $curr_schema_idx -eq $last_schema_idx ]]; then
        last_schema=true
    fi
    if [ -d "${i}" ]; then
        declare -a files
        files=(${i}/*)
        last_idx=$(( ${#files[*]} - 1 ))
        curr_idx=0
        for j in ${i}/*; do
            BUNDLE_PATH=${j}/OCABundle.json
            ID=$(grep '^| ' ${j}/README.md | sed -e "/OCA Bundle/,100d" -e "/Identifier/d" -e "/----/d" -e 's/^| \([^|]*\) |.*/\1/' -e 's/\s*$//' -e 's/ /~/g')
            last_id_idx=$(( ${#ID[*]} - 1 ))
            curr_id_idx=0
            for id in ${ID}; do
                delim=","
                if [[ $last_schema = true && $curr_idx -eq $last_idx ]]; then
                    delim=""
                fi
                echo "\"${id}\": { \"path\": \"${BUNDLE_PATH}\" }${delim}" | sed "s/~/ /g" >>${OCAIDSJSON}
                curr_id_idx=$(( $curr_id_idx + 1))
            done
            ORG=$(grep "Publishing\|Issuing" ${j}/README.md | sed -e "s/.*: //")
            NAME=$(sed -e "2,1000d" -e "s/# //" ${j}/README.md)
            DESC=$(sed -e "1,2d" -e "/## Identifiers/,1000d" -e "/^\s*$/d" -e "/^- /d" -e 's/[][]//g' -e 's/(.*)//g' -e 's/"/\\"/g' ${j}/README.md)
            TYPE="schema"
            if [ "$(echo ${j} | grep "schema")" == "" ]; then
                TYPE="credential"
            fi
            delim=","
            if [[ $last_schema = true && $curr_idx -eq $last_idx ]]; then
                delim=""
            fi
            echo "{ \"org\": \"${ORG}\", \"name\": \"${NAME}\", \"desc\": \"${DESC}\", \"type\": \"${TYPE}\", \"ocabundle\": \"${BUNDLE_PATH}\" }${delim}" >>${OCALISTJSON}
            curr_idx=$(( $curr_idx + 1))
        done
    fi
    curr_schema_idx=$(( $curr_schema_idx + 1))
done

echo -e "}" >>${OCAIDSJSON}
echo -e "]" >>${OCALISTJSON}
