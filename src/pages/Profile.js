// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';

// components
import Page from 'components/Page';

import ProfileData from 'components/Profile/ProfileData';
import {Link as RouterLink} from "react-router-dom";
import MyAds from "components/Profile/DisplayMyAds.jsx";


const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
    return (
        <RootStyle title="Connexion Market Vinci">
            <Container maxWidth="sm">
                <ContentStyle>
                    <div>
                        <Stack sx={{ mb: 5 }} >
                            <Typography variant="h4" gutterBottom >
                                Page de profil
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Mes informations.</Typography>
                        </Stack>

                        <ProfileData />

                    </div>
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
