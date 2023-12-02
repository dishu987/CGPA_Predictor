import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Alert,
  Box,
  Button,
  DialogContentText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import logo from "./assets/iit_ropar.jpg";

interface FormData {
  code: string;
  title: string;
  credits: string;
  grade: string;
}

const intialData: FormData = {
  code: "",
  credits: "",
  grade: "",
  title: "",
};

interface T extends Array<FormData> {}
function App() {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [form, setForm] = useState<FormData>(intialData);
  const [message, setMessage] = useState<string>("");
  const [courses, setCourses] = useState<T>([]);
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [currentCredits, setCurrentCredits] = useState("");
  const [results, setResults] = useState<any>({ cgpa: "", sgpa: "" });
  const handleClickOpen = () => {
    setOpen(true);
    setMessage("");
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
  const handleDelete = (code: string) => {
    let newArray: any = [];
    courses.forEach((element: any) => {
      if (element.code !== code) {
        newArray.push(element);
      }
    });
    setCourses([...newArray]);
    setMessage(`${code} has been deleted`);
    console.log(newArray);
  };
  const handleEdit = (code: string) => {
    let elem: FormData | undefined = courses.find((item) => item.code === code);
    setForm(elem || intialData);
    setOpen(true);
  };

  const handleAdd = () => {
    if (
      form.code === "" ||
      form.credits === "" ||
      form.grade === "" ||
      form.title === ""
    ) {
      setMessage("Please fill the required fields!");
      return;
    } else {
      setMessage("");
      if (Number(form.grade) < 0 || Number(form.grade) > 10) {
        setMessage("Grade should be between 0 and 10");
        return;
      }
      if (Number(form.credits) < 0 || Number(form.credits) > 5) {
        setMessage("Credit should be between 0 and 5");
        return;
      }

      const existingIndex = courses.findIndex(
        (item) => item.code === form.code
      );

      if (existingIndex !== -1) {
        // Item with the same code already exists, update it
        const updatedCourses = [...courses];
        updatedCourses[existingIndex] = {
          code: form.code,
          credits: form.credits,
          grade: form.grade,
          title: form.title,
        };
        setCourses(updatedCourses);
      } else {
        // Item with the same code doesn't exist, add a new item
        setCourses([
          ...courses,
          {
            code: form.code,
            credits: form.credits,
            grade: form.grade,
            title: form.title,
          },
        ]);
      }

      setOpen(false);
      setForm(intialData);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm((prevFormData: any) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const calculate = () => {
    let a = 0,
      b = 0;
    courses?.map((item) => {
      a += Number(item.grade) * Number(item.credits);
      b += Number(item.credits);
    });
    let sgpa: any = (a / b).toFixed(3);
    let cgpa: any = (
      (Number(currentCGPA) * Number(currentCredits) + Number(sgpa) * b) /
      (b + Number(currentCredits))
    ).toFixed(3);
    sgpa = Number(sgpa);
    cgpa = Number(cgpa);
    setResults({ cgpa: cgpa, sgpa: sgpa });
    setOpen1(true);
  };
  return (
    <>
      <Box
        sx={{
          bgcolor: "#EEEEEE",
          minHeight: "100vh",
          padding: "20px",
          margin: "0",
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {" "}
              <img
                src={logo}
                alt="logo"
                srcSet={logo}
                style={{ width: "150px", margin: "20px" }}
              />
            </Box>

            <Typography variant="h3" align="center" color={"#000"} gutterBottom>
              IIT ROPAR
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color={"#000000"}
              gutterBottom
            >
              CGPA Predictor
            </Typography>
          </Box>
          <Box>
            <TextField
              type="number"
              id="outlined-basic"
              label="Current CGPA (x/10)"
              variant="outlined"
              sx={{ width: "40%", marginRight: "20px" }}
              onChange={(e) => {
                if (
                  Number(e.target.value) >= 0 &&
                  Number(e.target.value) <= 10
                ) {
                  setCurrentCGPA(e.target.value);
                }
              }}
              value={currentCGPA}
            />
            <TextField
              type="number"
              id="outlined-basic"
              label="Earned Credits(x/145)"
              variant="outlined"
              sx={{ width: "40%", marginRight: "20px" }}
              onChange={(e) => {
                if (
                  Number(e.target.value) >= 0 &&
                  Number(e.target.value) <= 145
                ) {
                  setCurrentCredits(e.target.value);
                }
              }}
              value={currentCredits}
            />
            <Button
              variant="contained"
              size="large"
              sx={{ height: "55px" }}
              onClick={handleClickOpen}
            >
              Add Course
            </Button>{" "}
            <Button
              variant="outlined"
              size="large"
              color="error"
              sx={{ height: "55px" }}
              onClick={() => window.location.reload()}
            >
              Reset
            </Button>
          </Box>
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr. Number</TableCell>
                    <TableCell>Subject Code</TableCell>
                    <TableCell align="right">Subject Title</TableCell>

                    <TableCell align="right">Number of Credits</TableCell>
                    <TableCell align="right">Expected Grade (x/10)</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses &&
                    courses.map((item: FormData, i: number) => {
                      return (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {i + 1}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.code}
                          </TableCell>
                          <TableCell align="right">{item.title}</TableCell>
                          <TableCell align="right">{item.credits}</TableCell>
                          <TableCell align="right">{item.grade}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{ marginRight: "10px" }}
                              onClick={() => handleEdit(item.code)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(item.code)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box alignContent={"center"} width={"100%"}>
            <Button
              variant="contained"
              size="large"
              sx={{ height: "55px" }}
              onClick={calculate}
              disabled={
                Number(courses.length) <= 0 ||
                currentCGPA === "" ||
                currentCredits === ""
              }
            >
              Calculate
            </Button>
          </Box>
        </Stack>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Course</DialogTitle>
        {message && (
          <DialogContentText>
            <Alert severity="error" sx={{ margin: "0 20px" }}>
              {message}
            </Alert>
          </DialogContentText>
        )}
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="code"
            label="Course Code"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={form.code}
          />
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Course Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={form.title}
          />
          <TextField
            autoFocus
            margin="dense"
            name="credits"
            label="Number of Credits ie 3"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={form.credits}
          />
          <TextField
            autoFocus
            margin="dense"
            name="grade"
            label="Expacted Grade (x/10)"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleChange}
            value={form.grade}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open1} onClose={handleClose1}>
        <DialogTitle>Results</DialogTitle>
        <DialogContent>
          <Typography variant="h6">SGPA : {results?.sgpa}</Typography>
          <Typography variant="h6">CGPA : {results?.cgpa}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose1}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
