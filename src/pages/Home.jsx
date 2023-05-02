import { useTheme } from '@emotion/react';
import {
  Button,
  Card,
  CardMedia,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { useState } from 'react';
import { useAccount, useBalance, useContractReads } from 'wagmi';
import BanditLsdtSwapAbi from '../abi/BanditLsdtSwap.json';
import EtherTextField from '../components/elements/EtherTextField';
import FooterArea from '../components/layouts/FooterArea';
import HeaderBar from '../components/layouts/HeaderBar';
import {
  ADDRESS_BANDIT,
  ADDRESS_BANDITLSDTSWAP,
  ADDRESS_LSDT,
} from '../constants/addresses';
import useCountdown from '../hooks/useCountdown';
import { bnToCompact } from '../utils/bnToFixed';
import { czCashBuyLink } from '../utils/czcashLink';

const banditLsdtSwapContract = {
  address: ADDRESS_BANDITLSDTSWAP,
  abi: BanditLsdtSwapAbi,
};

export default function Home() {
  const theme = useTheme();

  const textShadow = `0px 0px 10px ${theme.palette.primary.dark}, 0px 0px 5px ${theme.palette.primary.dark}`;

  const [lsdtValue, setLsdtValue] = useState(parseEther('0'));

  const { address, isConnecting, isDisconnected } = useAccount();

  const {
    data: swapperData,
    isError: swapperIsError,
    isLoading: swapperIsLoading,
  } = useContractReads({
    contracts: [
      {
        ...banditLsdtSwapContract,
        functionName: 'openTimestamp',
      },
      {
        ...banditLsdtSwapContract,
        functionName: 'closeTimestamp',
      },
    ],
  });

  const {
    data: lsdtBalData,
    isError: lsdtBalIsError,
    isLoading: lsdtBalIsLoading,
  } = useBalance({
    address: address,
    token: ADDRESS_LSDT,
  });

  const lsdtBal =
    !lsdtBalIsError && !lsdtBalIsLoading ? lsdtBalData?.value : parseEther('0');

  const {
    data: banditBalData,
    isError: banditBalIsError,
    isLoading: banditBalIsLoading,
  } = useBalance({
    address: address,
    token: ADDRESS_BANDIT,
  });

  const banditBal =
    !banditBalIsLoading && !banditBalIsError
      ? banditBalData?.value
      : parseEther('0');

  const [openTimestamp, closeTimestamp] =
    !swapperIsLoading && !swapperIsError
      ? [swapperData[0].toNumber(), swapperData[1].toNumber()]
      : [0, 0];

  const startTimer = useCountdown(openTimestamp, 'Started');
  const endTimer = useCountdown(closeTimestamp, 'Ended');

  return (
    <>
      <HeaderBar
        lsdtBal={bnToCompact(lsdtBal, 18, 5)}
        banditBal={bnToCompact(banditBal, 18, 5)}
      />
      <Box
        css={{
          position: 'relative',
          backgroundColor: theme.palette.primary.dark,
          /*backgroundImage: "url('./images/BG1.png')",
          backgroundSize: 'contain',*/
          background:
            'linear-gradient(180deg, rgba(220,0,192,1) 5%, rgba(0,107,213,1) 10%, rgba(0,211,192,1) 30%, rgba(0,213,0,1) 60%, rgba(183,225,0,1) 90%)',
        }}
      >
        <Box
          as="img"
          sx={{ position: 'fixed', zIndex: 1, maxWidth: '75vw' }}
          src="./images/SUN.png"
        />
        <Container
          sx={{
            paddingTop: '1em',
            textAlign: 'left',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Card sx={{ boxShadow: textShadow }}>
            <CardMedia
              component="video"
              image="./vids/BANDIT_VIDEO.mp4"
              autoPlay
              loop
              muted
            />
          </Card>
          <Typography
            as="h1"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: '2em', md: '3em' },
              lineHeight: 1.1,
              textAlign: 'left',
              marginLeft: { xs: '1.5em', md: '1em' },
              marginTop: '1em',
              fontWeight: 'bold',
              textShadow: textShadow,
            }}
          >
            Unleash the Bandit Within:
            <br />
            Maximize Your Gains by Burning LSDT Today!
          </Typography>
          <Typography
            as="p"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: '1.5em', md: '2em' },
              lineHeight: 1.1,
              textAlign: 'center',
              marginLeft: { xs: '1.5em', md: '1em' },
              marginTop: '1em',
              fontWeight: 'bold',
              textShadow: textShadow,
            }}
          >
            OPEN: {startTimer}
            <br />
            CLOSE: {endTimer}
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <EtherTextField
              decimals={18}
              value={lsdtValue}
              onChange={(newValue) =>
                !!newValue
                  ? setLsdtValue(BigNumber.from(newValue))
                  : BigNumber.from(0)
              }
              renderInput={(props) => (
                <TextField
                  variant="standard"
                  sx={{
                    marginBottom: '1em',
                    marginTop: '1em',
                    '& .MuiInputBase-input': {
                      fontSize: '2em',
                      backgroundColor: theme.palette.secondary.dark,
                      paddingLeft: '1em',
                      textShadow: `0px 0px 20px ${theme.palette.primary.dark}, 0px 0px 5px ${theme.palette.primary.dark}, 0px 0px 2px ${theme.palette.primary.dark}`,
                    },
                  }}
                  {...props}
                />
              )}
              placeholder="0.00"
              min={BigNumber.from(0)}
              max={lsdtBal}
            />
            <br />
            <Button>
              <Box
                as="img"
                src="./images/BurnLsdt.png"
                variant="contained"
                alt="BURN LSDT"
                sx={{
                  width: '100%',
                  maxWidth: '445px',
                  cursor: 'pointer',
                  transition: '0.25s',
                  '&:hover': {
                    filter: 'hue-rotate(-200deg) invert(100%)',
                  },
                }}
              />
            </Button>
            <Typography
              as="p"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '1.5em', md: '2em' },
                lineHeight: 1.1,
                textAlign: 'center',
                marginLeft: { xs: '1.5em', md: '1em' },
                marginTop: '1em',
                fontWeight: 'bold',
                textShadow: textShadow,
              }}
            >
              1 LSDT = 15 🎭🔫💰🏴‍☠️👤
            </Typography>
            <br />
            <Button
              sx={{ marginTop: '5em' }}
              href={czCashBuyLink('BNB', ADDRESS_LSDT)}
              target="_blank"
            >
              <Box
                as="img"
                src="./images/BuyLsdt.png"
                variant="contained"
                alt="BURN LSDT"
                sx={{
                  width: '100%',
                  maxWidth: '445px',
                  cursor: 'pointer',
                  transition: '0.25s',
                  '&:hover': {
                    filter: 'hue-rotate(-200deg) invert(100%)',
                  },
                }}
              />
            </Button>
          </Box>
        </Container>
        <Box
          sx={{
            width: '100%',
            margin: '0',
            position: 'relative',
            top: '5px',
            zIndex: 2,
          }}
          as="img"
          src="./images/FLAMETHROWER.png"
        />
      </Box>
      <FooterArea sx={{ zIndex: 2, position: 'relative' }} />
    </>
  );
}
