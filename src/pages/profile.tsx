// src/pages/profile.tsx
import { CONFIG } from 'src/config-global';
import ProfileView from 'src/sections/profile/view/ProfileView'; // default import

// ----------------------------------------------------------------------

export default function Page() {
 console.log('ProfileView:', ProfileView);
  return (
    <>
      <title>{`Profile - ${CONFIG.appName}`}</title>
      <ProfileView />
    </>
  );
}
