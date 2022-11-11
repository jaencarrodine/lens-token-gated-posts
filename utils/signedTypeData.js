export function signedTypeData (domain, types, value) {
    const signer = getSigner();
    return signer._signTypedData(
      omitDeep(domain, '__typename'),
      omitDeep(types, '__typename'),
      omitDeep(value, '__typename')
    )
}