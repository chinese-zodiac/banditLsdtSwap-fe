import { useTheme } from '@emotion/react';
import { Paper, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { useWeb3Modal } from '@web3modal/react';
import makeBlockie from 'ethereum-blockies-base64';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

function HeaderBar({ lsdtBal, banditBal }) {
  const theme = useTheme();

  const {
    isOpen: web3ModalIsOpen,
    open: web3ModalOpen,
    close: web3ModalClose,
  } = useWeb3Modal();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: theme.palette.primary.dark }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-around' }}>
            <a sx={{ mr: 1 }} href="./">
              <Box
                as="img"
                src="./logo.png"
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  maxWidth: 50,
                  transition: '.25s ease-in-out',
                  '&:hover': { transform: 'rotate(-4deg)' },
                }}
              />
              <Box
                as="img"
                src="./logo.png"
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  maxWidth: 32,
                }}
              />
            </a>
            {!!address && (
              <Tooltip title="Your Wallet's LSDT & Bandit Balance">
                <Paper
                  sx={{
                    flexGrow: 0,
                    margin: 2,
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.primary.dark,
                    padding: 1,
                  }}
                >
                  LSDT:{' '}
                  <Typography
                    as="span"
                    sx={{
                      color: theme.palette.accent.light,
                    }}
                  >
                    {lsdtBal}
                  </Typography>{' '}
                  🎭🔫💰🏴‍☠️👤:{' '}
                  <Typography
                    as="span"
                    sx={{
                      color: theme.palette.accent.light,
                    }}
                  >
                    {banditBal}
                  </Typography>
                </Paper>
              </Tooltip>
            )}

            <Box sx={{ flexGrow: 0 }}>
              {!!address ? (
                <>
                  <Tooltip title="Open Wallet Settings">
                    <Button
                      onClick={web3ModalOpen}
                      variant="contained"
                      color="primary"
                      sx={{
                        width: '9em',
                        textTransform: 'unset',
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.dark,
                      }}
                    >
                      <Avatar
                        alt={address}
                        src={makeBlockie(address)}
                        sx={{
                          mr: 1,
                          height: 'auto',
                          width: '0.9em',
                          border: 'solid 1px ' + theme.palette.text.dark,
                        }}
                      />
                      0x...{address.substring(38)}
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Login Your Wallet">
                    <Button
                      onClick={web3ModalOpen}
                      color="primary"
                      variant="contained"
                      sx={{
                        width: '9em',
                        color: theme.palette.text.dark,
                        fontWeight: 'bold',
                      }}
                    >
                      Connect
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default HeaderBar;
