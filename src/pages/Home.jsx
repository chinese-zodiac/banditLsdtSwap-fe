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
import { BigNumber, constants } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { useState } from 'react';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import BanditLsdtSwapAbi from '../abi/BanditLsdtSwap.json';
import IERC20Abi from '../abi/IERC20.json';
import EtherTextField from '../components/elements/EtherTextField';
import TxStatus from '../components/elements/TxStatus';
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

const lsdtContract = {
  address: ADDRESS_LSDT,
  abi: IERC20Abi,
};

const banditContract = {
  address: ADDRESS_BANDIT,
  abi: IERC20Abi,
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
    data: banditTotalSupplyData,
    isError: banditTotalSupplyIsError,
    isLoading: banditTotalSupplyIsLoading,
  } = useContractRead({
    ...banditContract,
    functionName: 'totalSupply',
    watch: true,
  });

  const banditTotalSupply =
    !banditTotalSupplyIsError && !banditTotalSupplyIsLoading
      ? banditTotalSupplyData
      : parseEther('0');

  const {
    data: lsdtBalData,
    isError: lsdtBalIsError,
    isLoading: lsdtBalIsLoading,
  } = useBalance({
    address: address,
    token: ADDRESS_LSDT,
    watch: true,
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
    watch: true,
  });

  const banditBal =
    !banditBalIsLoading && !banditBalIsError
      ? banditBalData?.value
      : parseEther('0');

  const {
    data: lsdtAllowanceData,
    isError: lsdtAllowanceIsError,
    isLoading: lsdtAllowanceIsLoading,
  } = useContractRead({
    ...lsdtContract,
    functionName: 'allowance',
    args: [address, ADDRESS_BANDITLSDTSWAP],
    watch: true,
  });

  const lsdtAllowance =
    !lsdtAllowanceIsLoading && !lsdtAllowanceIsError
      ? lsdtAllowanceData
      : parseEther('0');

  const [openTimestamp, closeTimestamp] =
    !swapperIsLoading && !swapperIsError && !!swapperData[0] && !!swapperData[1]
      ? [swapperData[0].toNumber(), swapperData[1].toNumber()]
      : [0, 0];

  const startTimer = useCountdown(openTimestamp, 'Started');
  const endTimer = useCountdown(closeTimestamp, 'Ended');

  const { config: configApproveLsdt } = usePrepareContractWrite({
    ...lsdtContract,
    functionName: 'approve',
    args: [ADDRESS_BANDITLSDTSWAP, constants.MaxUint256],
  });
  const {
    data: dataApproveLsdt,
    error: errorApproveLsdt,
    isLoading: isLoadingApproveLsdt,
    isSuccess: isSuccessApproveLsdt,
    isError: isErrorApproveLsdt,
    write: writeApproveLsdt,
  } = useContractWrite(configApproveLsdt);

  const { config: configBurnLsdt } = usePrepareContractWrite({
    ...banditLsdtSwapContract,
    functionName: 'burnLsdtForBandit',
    args: [lsdtValue, address],
  });
  const {
    data: dataBurnLsdt,
    error: errorBurnLsdt,
    isLoading: isLoadingBurnLsdt,
    isSuccess: isSuccessBurnLsdt,
    isError: isErrorBurnLsdt,
    write: writeBurnLsdt,
  } = useContractWrite(configBurnLsdt);

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
            zIndex: 4,
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
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '68s, 19s',
              animationIterationCount: 'infinite ',
              animationDelay: '0s, 0s',
            }}
          />
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              filter: 'hue-rotate(-3deg)',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '61s, 29s',
              animationIterationCount: 'infinite ',
              animationDelay: '2s, 0s',
            }}
          />
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              filter: 'hue-rotate(3deg)',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '71s, 23s',
              animationIterationCount: 'infinite ',
              animationDelay: '7s, 0s',
            }}
          />
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              filter: 'hue-rotate(-5deg)',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '52s, 17s',
              animationIterationCount: 'infinite ',
              animationDelay: '11s, 0s',
            }}
          />
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              filter: 'hue-rotate(5deg)',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '55s, 25s',
              animationIterationCount: 'infinite ',
              animationDelay: '16s, 0s',
            }}
          />
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              filter: 'hue-rotate(-10deg)',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '83s, 16s',
              animationIterationCount: 'infinite ',
              animationDelay: '1s, 0s',
            }}
          />
          <Box
            as="img"
            src="./images/CLOUD.png"
            sx={{
              left: '-150vw',
              filter: 'hue-rotate(10deg)',
              maxWidth: '90vw',
              margin: 0,
              position: 'absolute',
              animationName: 'slideCloud1, floatCloud1',
              animationDuration: '57s, 20s',
              animationIterationCount: 'infinite ',
              animationDelay: '17s, 0s',
            }}
          />
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
              position: 'relative',
              zIndex: 4,
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
              position: 'relative',
              zIndex: 4,
            }}
          >
            OPEN: {startTimer}
            <br />
            CLOSE: {endTimer}
            <br />
            TOTAL LSDT Burned: {bnToCompact(
              banditTotalSupply?.div(15),
              18,
              3
            )}{' '}
            <br />
            TOTAL 🎭🔫💰🏴‍☠️👤 Minted: {bnToCompact(banditTotalSupply, 18, 3)}
          </Typography>
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 4 }}>
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
                onClick={() => {
                  if (lsdtAllowance?.lt(lsdtBal ?? BigNumber.from(0))) {
                    //approve
                    writeApproveLsdt();
                  } else {
                    //Burn
                    writeBurnLsdt();
                  }
                }}
              />
            </Button>
            <Typography
              as="div"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '0.8em', md: '1em' },
                lineHeight: 1.1,
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: textShadow,
              }}
            >
              Approve Status:{' '}
              {lsdtAllowance?.gte(lsdtBal ?? BigNumber.from(0)) ? (
                <Typography as="span" sx={{ color: 'lime' }}>
                  OK
                </Typography>
              ) : (
                <Typography as="span" sx={{ color: 'cyan' }}>
                  Click Burn LSDT to approve
                </Typography>
              )}
              <TxStatus
                isLoading={isLoadingApproveLsdt}
                isSuccess={isSuccessApproveLsdt}
                isError={isErrorApproveLsdt}
                txHash={dataApproveLsdt?.hash}
                errMsg={errorApproveLsdt?.message}
              />
            </Typography>
            <Typography
              as="div"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '0.8em', md: '1em' },
                lineHeight: 1.1,
                textAlign: 'center',
                fontWeight: 'bold',
                textShadow: textShadow,
              }}
            >
              Burn Tx Info:{' '}
              <TxStatus
                isLoading={isLoadingBurnLsdt}
                isSuccess={isSuccessBurnLsdt}
                isError={isErrorBurnLsdt}
                txHash={dataBurnLsdt?.hash}
                errMsg={errorBurnLsdt?.message}
              />
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
          as="img"
          src="./images/BIRD.png"
          sx={{
            width: { xs: '100px', md: '256px' },
            margin: 0,
            position: 'absolute',
            animationName: 'bird',
            animationDuration: '125s',
            animationIterationCount: 'infinite ',
            animationDelay: '0s',
            zIndex: 3,
          }}
        />
        <Box
          sx={{
            width: '100%',
            margin: '0',
            position: 'relative',
            top: '5px',
            zIndex: 4,
          }}
          as="img"
          src="./images/FLAMETHROWER.png"
        />
      </Box>
      <FooterArea sx={{ zIndex: 4, position: 'relative' }} />
    </>
  );
}
