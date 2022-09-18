import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily:"'Montserrat', sans-serif"
    },
    filterPaper: '80%',
    palette: {
        primary: {
            main: '#284A41'
        },
        secondary:{
            main: '#284A41'
        },
        tertiary: {
            main: '#284A41'
        }
    }
    // components: {
    //     MuiCssBaseline: {
    //         styleOverrides: `
    //         @font-face {
    //             font-family: "ThemeFont-Primary";
    //             src: url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Light.eot?iefix") format("eot"),
    //                src: url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Light.woff") format("woff),
    //                url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Light.ttf") format("truetype"),
    //                url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Light.svg#webfont") format("svg");
    //         }
        
    //         @font-face {
    //             font-family: 'ThemeFont-Secondary';
    //             src: url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Bold.eot?iefix") format("eot"),
    //             src: url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Bold.woff") format("woff"),
    //             url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Bold.ttf") format("truetype"),
    //             url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Bold.svg#webfont") format("svg");
    //         }
        
    //         @font-face {
    //             font-family: 'ThemeFont-Tertiary';
    //             src: url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Black.eot?iefix") format("eot"),
    //             src: url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Black.woff") format("woff"),
    //             url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Black.ttf") format("truetype"),
    //             url("https://www.carlsbergdeutschland.de/assets/fonts/CarlsbergSans-Black.svg#webfont") format("svg);
    //         }
    //         `
    //     }
    // }
})

export default theme;