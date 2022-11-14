import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import Dropdown from './Utils/Dropdown.js'
import TextInput from './Utils/TextInput.js'
import AlchemyAPI from '../../lib/alchemy.js'
import { useCallback } from 'react'
import debounce from 'lodash.debounce'
import { useAccessControlData } from '../../store/useAccessControlData.js'
const networkOptions = [
    {
        id:1,
        name: 'Ethereum',
        networkCode: 'ETH_MAINNET',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzI1MjkyRSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNhKSIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTQgMjhhMTQgMTQgMCAxIDAgMC0yOCAxNCAxNCAwIDAgMCAwIDI4WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTguMTkgMTQuNzcgMTQgMTguMjFsNS44LTMuNDQtNS44IDguMTktNS44MS04LjE5WiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0xNCAxNi45My01LjgxLTMuNDRMMTQgNC4zNGw1LjgxIDkuMTVMMTQgMTYuOTNaIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCIgeDI9IjE0IiB5MT0iMCIgeTI9IjI4IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIxNCIgeDI9IjE0IiB5MT0iMTQuNzciIHkyPSIyMi45NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iLjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K'
    },
    {
        id:2,
        name: 'Polygon',
        networkCode: 'MATIC_MAINNET',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjODI0N0U1IiByeD0iMTQiLz48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9InVybCgjYSkiIGZpbGwtb3BhY2l0eT0iLjMiIHJ4PSIxNCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOC4yOCAxMC45MmExLjA2IDEuMDYgMCAwIDAtMS4wNiAwbC0yLjQxIDEuNDItMS42NS45My0yLjQxIDEuNDNjLS4zMS4xOS0uNzIuMTktMS4wNiAwbC0xLjkyLTEuMTJhMS4wNyAxLjA3IDAgMCAxLS41My0uOXYtMi4yYTEgMSAwIDAgMSAuNTMtLjlsMS45LTEuMDhjLjMtLjE4LjctLjE4IDEuMDQgMGwxLjkgMS4wOWMuMy4xOC41Mi41Mi41Mi45djEuNDJsMS42NC0uOTZWOS41MmExIDEgMCAwIDAtLjUyLS45bC0zLjUtMi4wNGExLjA2IDEuMDYgMCAwIDAtMS4wNiAwTDYuMTMgOC42M2ExIDEgMCAwIDAtLjUzLjl2NC4xMmExIDEgMCAwIDAgLjUzLjlsMy41NiAyLjA0Yy4zMS4xOS43MS4xOSAxLjA2IDBsMi40MS0xLjQgMS42NS0uOTUgMi40MS0xLjRjLjMxLS4xOS43Mi0uMTkgMS4wNiAwbDEuODkgMS4wOWMuMy4xOC41My41Mi41My45djIuMmExIDEgMCAwIDEtLjUzLjlsLTEuOSAxLjExYy0uMy4xOS0uNy4xOS0xLjA1IDBsLTEuODktMS4wOGExLjA3IDEuMDcgMCAwIDEtLjUyLS45di0xLjQzbC0xLjY1Ljk2djEuNDNhMSAxIDAgMCAwIC41My45bDMuNTYgMi4wNGMuMzEuMTkuNzIuMTkgMS4wNiAwbDMuNTYtMi4wNGMuMzEtLjE5LjUzLS41My41My0uOXYtNC4xM2ExIDEgMCAwIDAtLjUzLS45bC0zLjYtMi4wN1oiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwIiB4Mj0iMTQiIHkxPSIwIiB5Mj0iMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K',
    },
    {
        id:3,
        name:'mumbai',
        networkCode: 'MATIC_MUMBAI',
        image:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSIjODI0N0U1IiByeD0iMTQiLz48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIGZpbGw9InVybCgjYSkiIGZpbGwtb3BhY2l0eT0iLjMiIHJ4PSIxNCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOC4yOCAxMC45MmExLjA2IDEuMDYgMCAwIDAtMS4wNiAwbC0yLjQxIDEuNDItMS42NS45My0yLjQxIDEuNDNjLS4zMS4xOS0uNzIuMTktMS4wNiAwbC0xLjkyLTEuMTJhMS4wNyAxLjA3IDAgMCAxLS41My0uOXYtMi4yYTEgMSAwIDAgMSAuNTMtLjlsMS45LTEuMDhjLjMtLjE4LjctLjE4IDEuMDQgMGwxLjkgMS4wOWMuMy4xOC41Mi41Mi41Mi45djEuNDJsMS42NC0uOTZWOS41MmExIDEgMCAwIDAtLjUyLS45bC0zLjUtMi4wNGExLjA2IDEuMDYgMCAwIDAtMS4wNiAwTDYuMTMgOC42M2ExIDEgMCAwIDAtLjUzLjl2NC4xMmExIDEgMCAwIDAgLjUzLjlsMy41NiAyLjA0Yy4zMS4xOS43MS4xOSAxLjA2IDBsMi40MS0xLjQgMS42NS0uOTUgMi40MS0xLjRjLjMxLS4xOS43Mi0uMTkgMS4wNiAwbDEuODkgMS4wOWMuMy4xOC41My41Mi41My45djIuMmExIDEgMCAwIDEtLjUzLjlsLTEuOSAxLjExYy0uMy4xOS0uNy4xOS0xLjA1IDBsLTEuODktMS4wOGExLjA3IDEuMDcgMCAwIDEtLjUyLS45di0xLjQzbC0xLjY1Ljk2djEuNDNhMSAxIDAgMCAwIC41My45bDMuNTYgMi4wNGMuMzEuMTkuNzIuMTkgMS4wNiAwbDMuNTYtMi4wNGMuMzEtLjE5LjUzLS41My41My0uOXYtNC4xM2ExIDEgMCAwIDAtLjUzLS45bC0zLjYtMi4wN1oiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwIiB4Mj0iMTQiIHkxPSIwIiB5Mj0iMjgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4K',

    }
]
export default function GatePostModal({open, setOpen}) {
  
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0])
  const [contractAddress, setContractAddress] = useState('')
  const [collectionInfo, setCollectionInfo] = useState(null)
  const accessControlConditions = useAccessControlData((state) => state.accessControlConditions)
  const setAccessControlConditions = useAccessControlData((state) => state.setAccessControlConditions)
  useEffect(() => {
    loadNftData(contractAddress)
  }, [contractAddress, selectedNetwork])

  function handleContractChange(e) {
    setContractAddress(e.target.value)
  } 

  const loadNftData= useCallback(
    debounce(async (contractAddress) => { 
      console.log('loading')
      const alc = new AlchemyAPI(selectedNetwork.networkCode)
      let collectionInfo = await alc.getNftCollectionData(contractAddress)
      setCollectionInfo(collectionInfo)
      console.log(collectionInfo)
    }, 100),
    []
  );

  function handleSave(){
    
    const accessControlConditions = [
      {
        "conditionType": "evmBasic",
        "contractAddress": contractAddress,
        "standardContractType": "ERC721",
        "chain": selectedNetwork.name,
        "method": "balanceOf",
        "parameters": [
            ":userAddress",
        ],
        "returnValueTest": {
            "comparator": ">=",
            "value": "1"
        }
      }
  ]
    setAccessControlConditions(accessControlConditions)
    setOpen(false)
  }

 
  

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className=" relative transform overflow-hidden rounded-lg bg-base-200 text-neutrual px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div  className='flex flex-col space-y-4' >
                  <h2 className='text-3xl'>Token Gate Your Post</h2>
                  <div><Dropdown name = 'What chain is the NFT on?' options = {networkOptions} selected = {selectedNetwork} setSelected = {setSelectedNetwork}  /></div>
                  <div><TextInput name = 'Nft Contract Address' value= {contractAddress} handleChange ={handleContractChange} /></div>
                </div>
                {collectionInfo && 
                <>
                  <div className='flex w-full items-center justify-center mt-3'>Only users who own:</div>
                  <div className='w-full bg-base-100 shadow-lg rounded-lg p-3 flex flex-row mt-3 space-x-2'>
                    <div className='w-1/6 h-auto '>
                      {collectionInfo.openSea?.imageUrl !== undefined && <img src = {collectionInfo.openSea.imageUrl} />}
                    </div>

                    <div>
                      <div className='font-semibold'>{collectionInfo.openSea?.collectionName || collectionInfo.name}</div>
                      <div className='text-primary'><a href = {collectionInfo.openSea?.externalUrl}>{collectionInfo.openSea?.externalUrl}</a></div>
                    </div>

                  </div>
                  <div className='flex w-full items-center justify-center mt-3'>will be able to decrypt this post.</div>
                </>
               
                  
                }
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
