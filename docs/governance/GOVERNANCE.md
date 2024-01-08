# BC Government Aries OCA Bundle Registry Governance Document

## Purpose

This Governance Document outlines how the OCA Bundle Registry is managed and governed. It defines the Roles and Processes needed to publish OCA bundles that are used by Hyperledger Aries Agents. These OCA bundles contain instructions to correctly process and display digital credentials.

The contents of the registry is maintained in the [registry repository] and
managed through a pull request submission, review and approval process. The
details of how pull requests are managed is outlined in this Governance section
of the registry.

[BC Government Digital Trust Group]: https://digital.gov.bc.ca/digital-trust/
[Registry Repository]: https://github.com/bcgov/aries-oca-bundles

## Roles

- The **[BC Government Digital Trust Group]** is the governing authority over this
repository. This group consists of a team of individuals within the Digital Credentials Services of the BC Government Ministry of Citizen's Services. This list is managed in the [MAINTAINERS](./MAINTAINERS.md) file. 

- **Editors** are individuals delegated by the [BC Government Digital Trust Group] to process issues and pull requests
according to the rules defined in the [Pull Request
Handling](#pull-request-handling) section of this document. Editors are given
[GitHub Maintain role](https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-roles-for-an-organization#repository-roles-for-organizations)
in the repository to manage their work. The Editors are listed in the [MAINTAINERS](./MAINTAINERS.md) in this [registry repository].

- **Implementers** are individuals or organizations that may add OCA Bundles to the
  registry for the Schemas they publish or verifiable credentials they issue.
  - For a new OCA Bundle, the Editors must contact and verify
 the identity of the implementer, and that the submitter represents the
 Implementer.
  - For an update to an OCA Bundle, the submitter is listed as
    `Authorized` in the OCA Bundle `README.md` file.

- **Contributors** are individuals that submit pull requests that propose
changes to the registry or any part of the repository that is the source of the
registry. Anyone with a GitHub account can be a contributor.

- **Readers** are individuals that read the registry and use the information
there in to move forward their use of AnonCreds.

### Types of Content

There are two types of content in the source repository for the registry:

- The entries in the OCABundles [Registry Repository].
  - The content of the entries are managed by the implementers of specific
    OCA Bundles.
  - The format of the entries MUST adhere to the guidelines outlined in the
[Adding an OCA Bundle] documentation, as defined by
the [BC Government Digital Trust Group].

[Adding an OCA Bundle]: ../contributing/CONTRIBUTING.md

- All other content in the registry and [Registry Repository]
  - Such content is governed by the [BC Government Digital Trust Group], and
    includes things like this Governance section of the registry, the format of
    the method entries, how the registry is published, and so on.
    - Anything about the management of the registry may be changed through an
      update to this type of content.

## Pull Request Handling

The [BC Government Digital Trust Group] MUST approve all changes to be merged
into the registry (additions, updates and deletions) and to the rules for the
management (governance) of the registry.

The [BC Government Digital Trust Group] has
delegated to the Editors the authority to merge pull requests of any [type of
content](#types-of-content) as follows:

- Based on an explicit authorization of the [BC Government Digital Trust Group] to merge the pull request; or
- When, in the judgement of the Editors, the change is simple editorial update
  that improves the content of any type; or
- When the pull request is to add or update a Registry entry, and, in the
  judgement of the Editors,
  - the entry adheres to the registry entry guidelines, and
  - the links in the registry entries resolve to relevant content (e.g. the
    specification of the method), and
  - the Editors have sufficiently verified the submitter of the
  pull request is an Implementer for the impacted OCA Bundle(s).

> NOTE: In the future, it would be nice to add an automated authorization check
via a GitHub Action to remove the verification burden from the Editors. For
example, the submitter might need to provide cryptographically signed data
using the DID related to the OCA Bundle.

The [BC Government Digital Trust Group] has
delegated to the Editors the authority to cancel pull requests of either type of
content as follows:

- Based on an explicit authorization of the [BC Government Digital Trust Group] to merge the pull request; or
- When, in the judgement of the Editors, the change is spam or a mistake, or
- When, in the judgement of the Editors, the change is an attempt to update the content of an Implementer that is not
authorized by the Implementer.
  - An Implementer MAY approve a Pull Request from a Contributor not otherwise authorized to update the content.
- When, in the judgement of the Editors, the change is a simple editorial update
  that is either incorrect or does not improve the content.

The [BC Government Digital Trust Group] has delegated to the Editors the
authority to raise (for discussion or vote) to the [BC Government Digital Trust
Group] any other pull requests. Prior to the raising of a pull request to the
leadership of the [BC Government Digital Trust Group] for processing, the
Editors (and any other contributor) may work with the submitter of the pull
request to clarify and/or improve the pull request such that it fits in the
categories above for merging or cancellation.
