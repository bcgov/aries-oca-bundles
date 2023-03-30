# Aries OCA Bundles

This GitHub repository is for hosting published Overlays Capture Architecture
(OCA) Bundles to be used by Hyperledger Aries agents (issuers, holders and
verifiers). The repository includes a [lightweight governance](GOVERNANCE.md)
process for ensuring those contributing to the repository are the "authority"
over the OCA Bundle they are submitting/updating, and that what they are
submitting is, in fact, an OCA Bundle for a published AnonCreds Schema and/or
Credential Definition.

The OCA Bundles should follow the rules for [OCA for Aries]() OCA Bundles,
including the [OCA for Aries Style Guide](). Each OCA Bundle must be accompanied
by some metadata about the credential, such as on what ledger the credential
schema and definition (CredDef) reside, and may be accompanied by the full OCA
Source data--Excel and JSON files.  We have some tools in the repo for
converting OCA Source to the Bundle to make it easier for contributors.

Currently, the repository assumes that the OCA Bundles are for [Hyperledger
AnonCreds Verifiable Credentials](https://hyperledger.org/use/anoncreds). We
expect that other formats, such as W3C Verifiable Credentials Data Model
Standard JSON-LD credentials will also be eventually supported.

## Locations of OCA Bundles

OCA Bundles in this repository are found in the [OCABundles](./OCABundles/)
folder in this repository. That folder has a subfolder for each DID that
in the repository, and within each DID folder, a subfolder for each ID of
either a Schema object or a Credential Definition (CredDef) object. Within
the ID subfolder is found the OCA Bundle files, as documented below.

Where the Issuer is also the Schema Publisher, the issuing organization may use
the ID of the Schema or Object to identify the OCA Bundle for the issued
verifiable credentials. If the Issuer is not the publisher of the Schema, it
should use the ID of the Credential Definition for the subfolder holding the OCA
Bundle files.

If an issuer publishes multiple versions of a Schema or CredDef (and hence,
multiple IDs) that use the same OCA Bundle, a "redirect" mechanism is available
to eliminate the need to keep multiple copies of the same OCA Bundle in the
registry.

## Contributing an OCA Bundle

To contribute an OCA Bundle, create a pull request that adds the necessary files
for the Aries for OCA:

* In the OCABundles folder, create a folder using the DID of the Schema
  Publisher or the CredDef publisher.
* In that folder, create a folder named for the ID of the Schema or for the
  CredDef.
* In that folder, add the following files, as appropriate:
    * REDIRECT.md: a markdown file containing a link to another folder within the
      repository that contains another OCABundle. This can be used, for example,
      to manage a Dev, Test and Prod versions of the same credential that shares
      the identical OCA Bundle. The format of the file must contain the
      information outlined below in the section [Redirect File Content](#redirect-file-content) section of this document.
    * README.md: a readme file, containing the information outlined
      below in the [README File Content](#readme-file-content) section of this document.
    * OCABundle.json: the published OCA Bundle for the Schema or CredDef.
      Required if there is no "redirect.md" file in the folder. See the section
      on [Agent Processing](#agent-processing) in this repository for how an
      Aries Agent finds the correct OCA Bundle JSON file to use.
    * testdata.csv: (optional) A CSV file containing one or more sample data
      records. Typically, either a CSV or a JSON test data file is added.
    * testdata.json: (optional) A JSON file containing one or more sample data
      records. Typically, either a CSV or a JSON test data file is added.
    * \<OCASourceExcel>.xlsx: (optional) The Excel OCA Source file for the OCA Bundle.
    * branding.json: (optional) The JSON file containing the source content for
      the OCA for Aries Branding overlay.

The pull request will be reviewed according to the [lightweight governance](GOVERNANCE.md)
process and merged (or not) into the repository.

### README File Content

The README.md file for the OCA Bundle **MUST** include some informational data about
the verifiable credential. The README.md file is optional if a REDIRECT.md file exists
in the folder.

The title (first line with `#`) **MUST** be the name of the credential type.

Below the title **MUST** be a brief description of the credential type. The first
paragraph of this description MAY be extracted and used for discovery of the
OCA Bundle.

The file **MUST** have an `Authorization` section, with the following content:

``` text

## Authorization

* Publishing Organization: <The name of the organization publishing the OCA Bundle>
* Primary Contact Email Address: <A contact email address for the publishing organization>
* OCA Source Data Location: <URL pointing to the OCA Source Data for the OCA Bundle>
* Verifiable Credential Instance: <Metadata about the verifiable credential, typically "Dev", "Test" or "Production">
* Verifiable Data Registry: <A link to the object to which the OCA Source Data applies>

The following are the GitHub IDs and email addresses of those authorized to make substantive updates to the OCA Bundle.

| OCA Bundle Contributors | GitHub ID | Email Address |
| ----------------------- | --------- | ------------- |
|                         |           |               |


```

#### Authorization Section Content

The initial entries are to ensure that the organization publishing the OCA
Bundle is known, and there is a primary contact for the information. This is
used when initially accepting a contributed OCA Bundle to verify (in the human
sense) that the publisher is known and there is a person or group to contact in
the organization when necessary.

If the OCA Source files are **NOT** found in the folder with the OCABundle.JSON,
the `OCA Source Data Location` entry is required and MUST contain a link to
where the source files can be found.

The `Verifiable Credential Instance` is optional metadata to help in managing
the multiple references to the same OCA Bundle.

The `Verifiable Data Registry` is not required if the related to the OCA Bundle
is uniquely resolvable using the \<DID> and \<Id> in the path to this folder. It
is required for OCA Bundles used with unqualified Hyperledger Indy DIDs so that
the VDR for the object is uniquely identified.

The table is used to ensure that updates to an OCA Bundle come from contributors
"authorized" by the publishing organization. If it is more convenient, the table
may be replaced with a line that links to another OCA Bundle Folder README, as
follows.

`The Authorization table for this OCA Bundle are in [this file](../../<DID>/<ID>/README.md).`

When used, the Authorization table from that file applies to this OCA Bundle.

### Redirect File Content

The format of the REDIRECT.md MUST be the following:

``` bash

DID: <DID>
ID: <Id>

# <Title of the credential type>

## Description

<Description of the credential type, used for discovery>.

## Redirection

DID: <DID>
ID: <Id>

## Authorization

* Publishing Organization: <Publishing Organization>
* Primary Contact Email Address: <Contact at Publishing Organization>
* Verifiable Credential Instance: <Instance or verifiable credential, usual Development, Test or Production>
* Verifiable Data Registry: <URL of related Schema or CredDef object on the VDR>

```

Most of the values to be completed match those in the [README.md document](#contents-of-the-readmemd-file).

The \<DID> and \<Id> **MUST** be the DID and Schema or CredDef ID for an
OCABundle that exists in the [registry repository].

The creator of the pull request creating the `REDIRECT.md` file must be
authorized per the `README.md` file in the target folder, or there
MUST be a`README.md` file along with the `REDIRECT.md` populated
as [described above](#contents-of-the-readmemd-file).

## Agent Processing

The following are the steps for processing the OCA Bundle by an Aries Holder or Verifier.

An Aries holder (wallet) or verifier agent **MUST** be pre-configured with the URL (\<URL> in the following) for accessing raw files in the
main branch of the `OCABundles` folder in this repository, e.g. `https://raw.githubusercontent.com/bcgov/aries-oca-bundles/main/OCABundles`.

On receipt of an AnonCreds Credential Definition ID, the Aries agent **SHOULD** do the following, using the Issuer's DID as the \<DID> and the given CredDefId as the \Id:

* Look for the file `<URL>/<issuer DID>/<Id>/OCABundle.json`.
* If found, use it as the OCA Bundle for the verifiable credential -- processing complete.
* Look for the file `<URL>/<DID>/<Id>/REDIRECT.md`
* If found, extract the \<DID> and \<Id> from the file (as described in the [Redirect File](#redirect-file) section) and continue to the next step using the new extracted data elements. If not found, continue with \<CredDefId> as \<Id> in the next step.

If no OCA Bundle or REDIRECT.md file is found, the agent **SHOULD** repeat the process with the Schema Publisher's DID as the \<DID> and the SchemaId as the \<Id>.

If there is still no OCA Bundle found, the agent continues without an OCA Bundle.

### Processing Notes

* A given Aries agent **MAY** want to pre-load OCA Bundles for Schemas or
Credential Definitions all of the \<DID>/\<Id>s in this repository, or a list of
those the agent is expected to work with. From time-to-time, such agents may
want to reload the Bundles in case they have been updated in the repository.
* An Aries agent **SHOULD NOT** assume the \<DID> and \<Id> formats will be in
"Legacy Indy" format. As `did:indy` use expands, and AnonCreds is used with
other Verifiable Data Registries, the DID and Id formats will vary.

## Creating the OCA Bundle JSON

See the instructions for creating an OCA Bundle JSON file from Excel and JSON source
in the file [OCABundleCreation.md](OCABundleCreation.md) in the root of this repository.
