import omitDeep from 'omit-deep'

export function signedTypeData (domain, types, value, signer) {
    return signer._signTypedData(
      omitDeep(domain, '__typename'),
      omitDeep(types, '__typename'),
      omitDeep(value, '__typename')
    )
}