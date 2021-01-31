import tw, { styled } from "twin.macro";

const TextInput = styled.input`
  ${tw`border p-2 rounded`}

  ::placeholder {
    ${tw`font-sans text-gray-600 text-xs`}
  }
`;

export default TextInput;
