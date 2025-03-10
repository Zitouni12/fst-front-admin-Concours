import * as React from 'react';
import Logout from '@mui/icons-material/Logout';
import { Account } from '@toolpad/core/Account';

export default function AccountCustomSlotProps({ session, authentication }) {
  return (
    <Account
      slotProps={{
        signInButton: { color: 'success' },
        signOutButton: { color: 'success', startIcon: <Logout /> },
        preview: {
          variant: 'expanded',
          slotProps: {
            avatarIconButton: { sx: { width: 'fit-content', margin: 'auto' } },
            avatar: { variant: 'rounded' },
          },
        },
      }}
    />
  );
}
