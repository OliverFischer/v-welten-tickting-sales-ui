import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '20%',
  left: '10%',
  //transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function PreviewModal() {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <div><b>Ticketing-UI Preview</b></div>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
            <p>
                Diese App wird in Kürze freigeschaltet. Wenn Sie eine Buchung tätigen wollen, 
                klicken Sie bitte auf den nachstehenden Link <br/><b>
                <a href="http://ticketing-v-welten.de/ticketing/login.jsp">http://ticketing-v-welten.de/ticketing/login.jsp</a></b>,
                <br/>
                um sich für eine Reservierung anzumelden!
            </p>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
