import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import styles from "./DocumentArea.module.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const url = process.env.REACT_APP_SERVER_URL;
const serverSideAccessToken = process.env.REACT_APP_ACCESS_TOKEN;

const DocumentArea: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { categoryId } = useParams();

  const dataFromStorage = sessionStorage.getItem("user");
  let token = "";
  let userName = "";
  if (dataFromStorage) {
    const parsedData = JSON.parse(dataFromStorage);
    token = parsedData.token;
    userName = parsedData.name;
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: token,
      Access: serverSideAccessToken,
    },
  };

  const bookConfig = {
    headers: {
      "Content-Type": "Application/json",
      Authorization: token,
      Access: serverSideAccessToken,
      Confirm: true,
    },
  };

  const bookData = {
    categoryId: categoryId,
    athleticId: location.state.athletic,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      handleUpload(file); // Envie o arquivo imediatamente
    }
  };

  const handlePDFChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]?.type === "application/pdf") {
      const file = e.target.files![0];
      setSelectedDocument(file);
      handleUpload(file); // Envie o arquivo imediatamente
    } else {
      alert("Por favor, selecione um arquivo PDF.");
    }
  };

  const handlePdfRemover = () => {
    setSelectedDocument(null);
    const pdfInput = document.getElementById("pdfInput") as HTMLInputElement;
    if (pdfInput) {
      pdfInput.value = "";
    }
  };

  const handleImageRemover = () => {
    setSelectedImage(null);
    const imageInput = document.getElementById(
      "imageInput"
    ) as HTMLInputElement;
    if (imageInput) {
      imageInput.value = "";
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUserToken = () => {
    const userToken = sessionStorage.getItem("user");
    if (!userToken || userToken === "undefined") {
      setIsLoggedIn(false);
      return navigate("/login");
    }
    setIsLoggedIn(true);
  };
  useEffect(() => {
    checkUserToken();
  }, [isLoggedIn]);

  const handleUpload = async (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("user", file);

      try {
        await axios.post(url + "auth/photouser/", formData, config);
        try {
          const userTicket = await axios.post(
            url + "admin/bookticket/",
            bookData,
            bookConfig
          );

          location.state.userTicket = userTicket.data;
        } catch (error) {
          console.error("book: ", error);
        }
      } catch (error) {
        console.error("photo: ", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedDocument && selectedImage)
      navigate(`/sport-events/buyticket/${categoryId}`, {
        state: location.state,
      });
  };

  return (
    <div className={styles.DocumentAreaContainer}>
      <Form.Group>
        <Form.Label>Selecione ou arraste o documento de imagem:</Form.Label>
        <div className={styles.DropFileContainer}>
          <Form.Control
            type="file"
            className={styles.DropArea}
            onChange={handleImageChange}
            id="imageInput"
          />
          <Button variant={selectedImage ? "success" : "danger"} disabled>
            {"    "}
          </Button>
        </div>
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className={styles.ImgArea}
          />
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label>
          Selecione ou arraste o documento no formato PDF:
        </Form.Label>
        <div className={styles.DropFileContainer}>
          <Form.Control
            type="file"
            className={styles.DropArea}
            onChange={handlePDFChange}
            id="pdfInput"
          />
          <Button variant={selectedDocument ? "success" : "danger"} disabled>
            {"    "}
          </Button>
        </div>
      </Form.Group>
      <Button variant="primary" onClick={handleSubmit}>
        Enviar
      </Button>
    </div>
  );
};

export default DocumentArea;
