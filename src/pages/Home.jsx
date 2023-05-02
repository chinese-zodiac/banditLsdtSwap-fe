import { useTheme } from '@emotion/react';
import {
  Button,
  Container,
  Icon,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { useState } from 'react';
import EtherTextField from '../components/elements/EtherTextField';
import FooterArea from '../components/layouts/FooterArea';
import HeaderBar from '../components/layouts/HeaderBar';
import { LINK_TELEGRAM } from '../constants/links';

export default function Home() {
  const theme = useTheme();

  const [lsdtValue, setLsdtValue] = useState(parseEther('0'));

  return (
    <>
      <Box css={{ backgroundColor: theme.palette.primary.dark }}>
        <HeaderBar />
        <Container
          sx={{ minHeight: '100vh', paddingTop: '1em', textAlign: 'left' }}
        >
          <Box sx={{ marginLeft: '3.5em', marginBottom: '0.5em' }}>
            <IconButton href={LINK_TELEGRAM} target="_blank">
              <Icon
                baseClassName="fab"
                className="fa-telegram"
                color="primary"
                sx={{
                  fontSize: '1.8em',
                  backgroundColor: theme.palette.primary.dark,
                  borderRadius: '0.9em',
                }}
              />
            </IconButton>
          </Box>
          <Typography
            as="h1"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: '2em', md: '3em' },
              lineHeight: 1.1,
              textAlign: 'left',
              marginLeft: { xs: '1.5em', md: '1em' },
              fontWeight: 'bold',
            }}
          >
            Unleash the Bandit Within:
            <br />
            Maximize Your Gains by Burning LSDT Today!
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <EtherTextField
              decimals={18}
              value={lsdtValue}
              onChange={(newValue) => setLsdtValue(BigNumber.from(newValue))}
              renderInput={(props) => (
                <TextField
                  variant="standard"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '2em' },
                  }}
                  {...props}
                />
              )}
              placeholder="0.00"
              max={parseEther('10000')}
              min={parseEther('0')}
            />
            <br />
            <Button variant="contained">BURN LSDT</Button>
            <br />
            <br />
            <br />
            <Button variant="contained">BUY LSDT ON CZ.CASH</Button>
          </Box>
        </Container>
        <FooterArea />
      </Box>
    </>
  );
}
