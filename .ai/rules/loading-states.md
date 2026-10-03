# Client-Server Request Loading States

## Context
When interacting with the server (API calls, Server Actions, or heavy asynchronous Client operations), it is crucial to provide visual feedback to the user. A lack of feedback makes the application feel unresponsive and broken.

## Rule
Whenever a Client component makes an asynchronous request to the server, it **MUST** implement a loading state. 

1. **Buttons**: Any button that triggers a server request (e.g., "Add to Cart", "Submit Order", "Login") MUST display a loading spinner inside the button and be `disabled` while the request is pending.
2. **Global Spinners (Optional)**: For page transitions or global data fetching, use Next.js `loading.tsx` or a global overlay spinner.
3. **Reusable Component**: Always use the reusable `Spinner` component (e.g., `<Spinner className="w-5 h-5 text-white" />`) rather than writing custom SVG spinners inline every time.
4. **State Management**: Use `React.useState(false)` (e.g., `const [isLoading, setIsLoading] = useState(false);`) or `React.useTransition()` to track the loading state in client components.

## Example Implementation
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await performServerRequest();
  } finally {
    setIsLoading(false);
  }
};

<button disabled={isLoading} onClick={handleAction}>
  {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : <Icon />}
  Submit
</button>
```
