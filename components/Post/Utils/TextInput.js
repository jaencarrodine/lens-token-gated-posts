/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid'

export default function TextInput({name,  value, handleChange}) {
  return (
    <div>
      <label htmlFor="account-number" className="block text-sm font-medium ">
        {name}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name="account-number"
          id="account-number"
          className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={name}
          onChange = {handleChange}
          value = {value}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

 
