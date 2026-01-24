'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function JoinPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get plan parameter if provided
    const plan = searchParams.get('plan');
    // Redirect to provider signup page with plan parameter
    const signupUrl = plan ? `/providers/signup?plan=${encodeURIComponent(plan)}` : '/providers/signup';
    router.push(signupUrl);
  }, [router, searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <p>Redirecting to provider signup...</p>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Inter, sans-serif'
      }}>
        <p>Loading...</p>
      </div>
    }>
      <JoinPageContent />
    </Suspense>
  );
} 