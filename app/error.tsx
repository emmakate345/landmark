'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p>{error?.message || 'An error occurred'}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
