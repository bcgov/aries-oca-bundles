# OCA Bundle Creation

Creating an OCA Bundle consists of multiple steps.

- Creating a folder in the [Aries OCA Bundles] repository (via a pull request).
- Creating the `README.md` file for the OCA Bundle.
- Creating the OCA Source data, usually in Excel and JSON.
- Generating an OCA Bundle from the OCA Source Data using a script in this repository.
  - The prerequisites for the script are a tad painful. We're hoping to reduce
      the complexity of the script.

[Aries OCA Bundles]: https://github.com/bcgov/aries-oca-bundles

We'll cover the steps in the following sections.

## Creating a Folder For Your OCA Bundle

Once you have forked the [Aries OCA Bundles] repository, create
the folder for your new OCA Bundle within the `OCABundles` folder. Your
folder can be placed arbitrarily deep, with some rules for the first
few levels.

`schema` is the (current) name for where credential OCA Bundles are to be
placed. That name may soon change (`credential` is a better name...), and in the
future, a parallel folder might be added for presentation request OCA Bundles.

Below `schema` is a list of top level credential issuers (e.g., BC Gov), and
within each, the sub-issuers (to any depth). As you add your OCA Bundle, feel
free to add as many layers of (sub-)issuers as appropriate. For example, you might include:

- the issuing sub-organization
- the type of credential
- different versions (e.g., 1.0, 1.1, 2.0, etc.) of the type of credential
- development, staging, and production versions of the credential

For each layer, you **MUST** add a `README.md` file in which the top level
markdown header **MUST** be the name of the (sub-)issuer. The `README.md` file
may optionally contain additional information about the (sub-)issuer. The
requirement for the `README.md` and the markdown header is that when generating
the GitHub Pages registry site, the required markdown header is extracted used
for the site navigation.

This hierarchy can be seen in the [OCA Bundles] tab of this registry.

Finally, there are the various files needed within the folder holding the OCA
Bundle. At minimum, those folders **MUST** have a `README.md` file populated in
a required format, and an `OCABundle.json` file that is the OCA Bundle itself.
There will usually be other files in the folder as well, including the Excel
source content for the OCA Bundle, and the `branding.json` overlay that defines
the colours, images, and other metadata that contributes to the branding of the
credential when displayed by an Aries agent. The creation of those files is
described in the subsequent sections.

## Creating the OCA Bundle README.md File

* **README.md**: **MUST** be present and **MUST** contain the information outlined
  below in the [README File Content](#readme-file-content) section of this document.
* **OCABundle.json**: **MUST** be present and **MUST** contain the OCA Bundle
  for the schema or credential definition.
* **<OCASourceExcel\>.xlsx**: (optional) An Excel OCA Source file for the OCA Bundle.
* **branding.json**: (optional) A JSON file containing the source content for
  the OCA for Aries Branding overlay.
* **testdata.csv**: (optional) A CSV file containing one or more sample data
  records.
* **Other files**: (optional) Other files related to the OCA Bundle, such as the
images used in the branding.json file.

The pull request will be reviewed according to the lightweight [governance]
process and merged (or not) into the repository.

[governance]: ../governance/GOVERNANCE.md

### README File Content

The README.md file for the OCA Bundle **MUST** be present and **MUST** include
the information shown and described below. The hard and fast formatting requirements
are in place because the file is processed by a script that generates two lists
of all of the identifiers (`schemaId`s and `credDefId`s) and the OCA Bundles
to which they are associated with. The lists are in the files [ocbundles.json]
and [ocabundleslist.json] in the root of the (GitHub Pages) registry website and
(for now) the root folder of the [Aries OCA Bundles] GitHub repository. If you are
referencing the registry in your code (such as in an Aries wallet or verifier agent),
use the registry versions of the files, as the repository ones are deprecated.

[ocbundles.json]: ../ocabundles.json
[ocabundleslist.json]: ../ocabundleslist.json

```text
# <TITLE>

<DESCRIPTION>

- Publishing Organization: <ORGANIZATION>
- Primary Contact Email Address: <CONTACT EMAIL ADDRESS>

## Identifiers

| Identifier                                 | Location  | URL         |
| ------------------------------------------ | --------- | ----------- |
| <SCHEMA ID or CRED DEF ID>                 | <LEDGER>  | <URL>       |

## Authorization

The following are the GitHub IDs of those authorized to make substantive updates to the OCA Bundle.

| OCA Bundle Contributors | GitHub ID   | Email Address            |
| ----------------------- | ----------- | ------------------------ |
| <NAME>                  | <GITHUB ID> | <EMAIL ADDRESS>          |

```

Everything not in `<>`s must be exactly as specified above (with one
exception--see below). Everything in `<>`s **MUST** be populated as described
below.

The two markdown tables **MAY** have multiple lines. Multiple lines in the
`Identifiers` table indicates that the same OCA Bundle is used for each of the
objects identified in the first column. Multiple lines in the `Authorization`
table is recommended so that multiple members of the submitters team may update
the OCA Bundle.

- `<TITLE>` **MUST** be the name of the credential type. No other line in the
  file can have a single `#` prefix.
- `<DESCRIPTION>` is extracted for display by tools for processing this
repository (such as the [OCA Explorer]) and should describe the type of
credential to which the OCA Bundle applies.
- `<ORGANIZATION>` is extracted for display by tools for processing this
repository (such as the [OCA Explorer]) and is the name of the organization
that submitted the OCA Bundle.
- `<CONTACT EMAIL ADDRESS>` is an email address for the primary contact
for the OCA Bundle. The address may for a person, or better, a group
contact withing the `<ORGANIZATION>`.
- `<SCHEMA ID or CRED DEF ID>` are identifiers for objects to which the
OCA Bundles applies. There can be multiple lines in the table, each with
a different identifier.
- `<LEDGER>` is optional. It identifies the ledger on which the object
identified by the object resides. It should be in the form
<network>[:<instance>] as defined in the [did-indy specification for
`namespace`](https://hyperledger.github.io/indy-did-method/#indy-did-method-identifiers)
-- e.g., `candy:dev` or `sovrin`. The value is useful when the `<SCHEMA ID or
CRED DEF ID>` is unqualified (such as with legacy Indy identifiers) such that
the precise location of the object is not known.
- `<URL>` is optional and is a plain (non-Markdown) link to a ledger browser
  instance of the object, such as to a transaction on
  [https://indyscan.io](https://indyscan.io),
  [http://test.bcovrin.vonx.io:3707](http://test.bcovrin.vonx.io:3707) or
  [https://candyscan.idlab.org/](https://candyscan.idlab.org/)
- `<NAME>` is the name of a person authorized to update the OCA Bundle and
related data. There may be multiple rows in the markdown table to name multiple
people.
- `<GITHUB ID>` is the GitHub ID of the named person.
- `<EMAIL ADDRESS>` is the email address of the named person

The `<CONTACT EMAIL ADDRESS>` and the Authorization table are to ensure that
once the OCA Bundle is submitted, there are contacts available to answer
questions about, and to submit updates to, the OCA Bundle.

The contents of the `Authorization` section (following the `## Authorization` line) may be replaced
with the following to avoid repeating the same contents in every OCA Bundle `README.md` file:

`The Authorization table for this OCA Bundle is in [this file](<path-to-another-OCABundle-folder/README.md).`

## Creating the OCA Source Data

Now that you have a folder and a README.md, it's time to create the OCA
Bundle Excel source file, and from that, generating the OCA Bundle itself. This
section assumes you are somewhat familiar with the [OCA Specification] including
the format of JSON OCA Bundles, and the various overlay types that have been
defined. As well, we assume you are familiar with [Aries for OCA RFC 0755], and
what OCA overlays are used for providing semantic, multi-language and branding
information about [Hyperledger AnonCreds] credential types. If you haven't gone
through that information, please start there.

[OCA Specification]: https://oca.colossi.network/specification/
[Hyperledger AnonCreds]: https://www.hyperledger.org/projects/anoncreds

In the [OCA for Aries RFC] are the instructions for creating the OCA Source
data. The following summarizes the steps of creating an OCA Source Excel file,
and a `branding.json` file for the Aries-specific "Branding" Overlay.

[OCA for Aries RFC]: https://github.com/hyperledger/aries-rfcs/blob/main/features/0755-oca-for-aries/README.md
[OCA for Aries Style Guide RFC]: https://github.com/hyperledger/aries-rfcs/blob/main/features/0756-oca-for-aries-style-guide/README.md

### OCA Excel File

An Aries OCA Bundle can be managed as pure JSON as found in this [sample OCA for
Aries OCA Bundle]. However, managing such content in JSON is not easy,
particularly if the multi-language translations come from team members not
comfortable with working in JSON. An easier way to manage the data is to use an
OCA source Excel spreadsheet for most of the data, add some in a simple source
`branding.json` file, and to use a generator (included in the [Aries OCA Bundles] GitHub
repository) to create the OCA Bundle file from the two sources.

[sample OCA for Aries OCA Bundle]: https://github.com/hyperledger/aries-rfcs/tree/main/features/0755-oca-for-aries/OCA4AriesBundle.json
[example here]: https://github.com/hyperledger/aries-rfcs/blob/main/features/0755-oca-for-aries/OCA4Aries.xlsx
[OCA Template]: https://github.com/THCLab/oca-parser-xls/blob//templates/template.xlsx
[Human Colossus Foundation]: https://humancolossus.foundation/
[Aries Specific Dates in the OCA Formats Overlay]: https://github.com/hyperledger/aries-rfcs/tree/main/features/0755-oca-for-aries#aries-specific-dates-in-the-oca-format-overlay

The OCA Source Spreadsheet ([example here]), contains the following:

- An introductory tab about the OCA content in the spreadsheet.
- A tab with instructions on using the spreadsheet.
- A "Main" tab with the "Capture Base" data, along with data for other, non-multilingual overlays.
- A language or country-language code tab per country-language to be supported by the issuer
  containing the source data for all multilingual overlays.

The following is how to create an OCA Source spreadsheet.

- Make a copy of the latest [OCA Template] from the [Human Colossus Foundation].
- Fill in the "Main" tab with the attributes from the schema, completing the
relevant columns for each attribute. Current columns to complete:
- CB-CL: Classification
- CB-AN: Attribute Name
- CB-AT: Attribute Type
- CB-FA: Flagged Attribute
- OL-CH: Character Encoding
- OL-FT: Format
- OL-ST: Standard
- OL-EC: Entry Codes
- OL-UT: Unit
- As needed, populate the columns for "dateint" and "Unix Time" attributes as indicated in the [Aries Specific Dates in the OCA Formats Overlay] section of RFC 0755.
- Rename the sample language tab (`en`) to one of the language or language-country that as an issuer, you want to support.
- Fill in the data in columns after C (which is automatically populated from
the `Main` tab) for the first language as appropriate. In most cases only
the "Label" and "Information" columns need be populated.
- Populate column A and B as follows:
- In column A (`OL-MN: Meta [Attribute Name]`), add the values:
  - "name"
  - "description"
  - "issuer"
  - "issuer_description"
  - "issuer_url"
  - "credential_help"
  - "credential_support_url"
- Complete column B (`OL-MV: Meta [Attribute Value]`) as appropriate for each column A name.
- Duplicate and rename the initial language tab for each language or language-country that as an issuer, you want to support.
- Update each additional language tab.

Once you have the Excel file, save it to the OCA Bundle folder for your Credential.

### The Branding JSON File

In addition to the OCA Source Excel file, you should create a Branding Overlay
JSON source file called `branding.json`. The format of the file is the following,
and it is fully described in the [OCA for Aries Style Guide RFC].

```json
[
    {
        "logo": "",
        "background_image_slice": "",
        "background_image": "",
        "primary_background_color": "#32674e",
        "secondary_background_color": "#32674e",
        "capture_base": "E75sopl65qnoZRwjQQ0FjWGemLlOXcXtanhScZ2CloJY",
        "digest": "EBQbQEV6qSEGDzGLj1CqT4e6yzESjPimF-Swmyltw5jU",
        "expiry_date_attribute": "",
        "primary_attribute": "",
        "secondary_attribute": "",
        "type": "aries/overlays/branding/1.0"
    }
]
```

To create the file for your OCA Bundle:

- Create a file called `branding.json` in the same folder as your OCA Source Excel file
- Populate the data values in the overlay as appropriate for your Credential.
- Do not change the values of the `type`, `capture_base` and `digest` items.

The image values may be URLs for the images. A common practice (but not
required) is to put the images in the same folder as the OCA Source Excel and
branding.json files, and to use the GitHub "raw" URL to reference the data, such
as:

`https://raw.githubusercontent.com/hyperledger/aries-oca-bundles/main/OCABundles/schema/bcgov-digital-trust/student-card/best-bc-logo.png`

If the images are relatively small, you can inline the images using the format `data:image/png;base64,<base64 data>`.

Once you have the Excel and JSON source files, you are ready to go!

## Generating an OCA Bundle from Source

A bash script `genBundle.sh` can be found in the `scripts` folder of the [Aries
OCA Bundles] GitHub repository. To use it, you will need to install a few
prerequisites--`jq` and the OCA Excel Parser.

### Prerequisites

Developers will likely have the `jq` (JSON Query) command line utility already installed. If not, follow the
[JQ installation instructions]. Once installed, make sure `jq` is on your path.

[JQ installation instructions]: https://stedolan.github.io/jq/download/
[Rust Installation Instructions]: https://www.rust-lang.org/tools/install

Installing the OCA Excel Parser is a little more involved, as you need Rust installed on your machine. Here are the steps:

- Clone a local copy of the OCA Excel Parser repository.
- If you don't have Rust installed on your machine, following the [Rust Installation Instructions], including installing all necessary dependencies.
- Follow the instructions in the repository README.md to build the parser. Currently it is just to execute `cargo build`.
- Copy the resulting executable to a directory on your PATH, e.g., `cp target/debug/parser ~/bin/`

### Running the Generator Script

Assuming you are in an OCABundles folder you can run the script with a relative path, such as:

`../../../scripts/genBundle.sh`

You might want to create a symbolic link to that script in a directory on your PATH to make it easier to use.

> **To Do:** We could really use a Docker container image published that has the
> generate script and prerequisites so that we can just run a container for
> generation. Volunteers?

The script checks to see that the pre-requisites (`jq` and `parser`) are
available and executable, erroring off it not, and, if run without arguments, prints a usage message.
Currently the `-x <excel file>` is required, and you can supply zero or more
JSON files to be added to the OCA Bundle produced from processing the Excel
file.

The OCA source files do not have to be in the current folder and can
be maintained wherever is best for your use case.

It is **strongly** recommended that you use the Excel file for managing the OCA
content, and use the generator to produce the actual OCA Bundle. Editing the OCA
Bundle directly means that the hash values (e.g. `capture_base` and `digest`)
values are out of sync with the content.
