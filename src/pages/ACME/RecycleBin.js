// Import necessary components and libraries
import React, { useContext, useEffect, useState } from "react";
import { notification } from "antd";
import Head from "../../layout/head/Head";
import ModalPop from "../../components/Modal";
import { Stack, Typography } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import Content from "../../layout/content/Content";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../../context/UserContext";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  Icon,
  Button,
} from "../../../src/components/Component";
import RecyclebinTable from "../../components/Tables/RecyclebinTable";

// RecycleBin component
const RecycleBin = () => {
  // Get necessary functions and data from UserContext
  const { getrecycle, restoreFiles, deleterestore } = useContext(UserContext);
  // State variables
  const [sm, updateSm] = useState(false);
  const [deleteId, setDeleteId] = useState(false);
  const [restore, setRestore] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [getRecycyleBin, setGetRecycleBin] = useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState({
    status: false,
    data: "",
  });
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  // Open the delete confirmation modal
  const handleClickOpen = (id, file_type) => {
    setOpen({
      status: true,
      data: { id, file_type },
    });
  };

  // Close the delete confirmation modal
  const handleClose = () => {
    setOpen({
      status: false,
      data: "",
    });
  };

  // Fetch Recycle Bin data when the component mounts or currentPage changes
  useEffect(() => {
    getRecycle();
  }, [restore]);

  useEffect(() => {
    getRecycle();
    setDeleteId(false);
  }, [deleteId]);
  // Get Recycle Bin Data
  const getRecycle = () => {
    getrecycle(
      {},
      (apiRes) => {
        console.log(apiRes, "pop");
        setTotalUsers(apiRes.data.data.length);
        setGetRecycleBin(apiRes?.data?.data);
      },
      (apiErr) => {}
    );
  };

  const onRestoreFiles = (id, file_type) => {
    console.log(file_type, id, "pppp");
    setRestore(true);
    let data;
    if (file_type) {
      data = { file_id: id };
    } else {
      data = { folder_id: id };
    }
    restoreFiles(
      data,
      (apiRes) => {
        if (apiRes.status == 200) {
          notification["success"]({
            placement: "top",
            description: "",
            message: "Restore File Successfully.",
            style: {
              marginTop: "43px",
              height: "60px",
            },
          });
        }
      },
      (apiErr) => {}
    );
  };
  // Delete Recycle Bin item
  const onDeleteClick = (id, file_type) => {
    console.log(id, file_type);
    handleClose();
    setDeleteId(true);
    let data = {
      id: id,
      file: file_type,
    };
    console.log(data);
    deleterestore(
      data,
      (apiRes) => {
        if (apiRes.status == 200) {
          notification["success"]({
            placement: "top",
            description: "",
            message: "Recycle Bin Deleted Successfully.",
            style: {
              marginTop: "43px",
              height: "60px",
            },
          });
        }
        setDeleteId(true);
      },
      (apiErr) => {}
    );
  };

  // Table header configuration
  const tableHeader = [
    {
      id: "File Name",
      numeric: false,
      disablePadding: true,
      label: "File Name",
    },
    {
      id: "Deleted Time",
      numeric: false,
      disablePadding: true,
      label: "Deleted Time",
    },
    {
      id: "Size",
      numeric: false,
      disablePadding: true,
      label: "Size",
    },
    {
      id: "Action",
      numeric: false,
      label: "Action",
      disablePadding: true,
      style: { marginLeft: "20px" },
    },
  ];
  // Return the JSX content
  return (
    <React.Fragment>
      {/* Delete confirmation modal */}
      <ModalPop
        open={open.status}
        handleClose={handleClose}
        handleOkay={onDeleteClick}
        title="Recycle is being Deleted. Are You Sure !"
        data={open.data.id}
        file_type={open.data.file_type}
      />
      <Head title="RecycleBin List - Regular"></Head>
      <Content>
        <Stack style={{ marginTop: "-28px" }}>
          {/* Block header */}
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <Typography
                  style={{
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  Recycle Bin
                </Typography>
                <BlockDes className="text-soft">
                  <p>You have total {totalUsers} RecycleBin.</p>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                {/* Toggle button for search bar */}
                <div className="toggle-wrap nk-block-tools-toggle">
                  <Button
                    className={`btn-icon btn-trigger toggle-expand mr-n1 ${
                      sm ? "active" : ""
                    }`}
                    onClick={() => updateSm(!sm)}
                  >
                    <Icon name="menu-alt-r"></Icon>
                  </Button>
                  {/* Search bar */}
                  <div
                    className="toggle-expand-content"
                    style={{ display: sm ? "block" : "none" }}
                  >
                    <ul
                      className="nk-block-tools "
                      style={{ marginTop: "20px" }}
                    >
                      <li className="nk-block-tools-opt">
                        <SearchBar
                          handleClick={() => setModal({ add: true })}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          searchButton="true"
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </BlockHeadContent>
            </BlockBetween>
          </BlockHead>
        </Stack>
        <Block>
          {/* Render the RecyclebinTable component */}
          <RecyclebinTable
            headCells={tableHeader}
            allfolderlist={getRecycyleBin}
            handleClickOpen={handleClickOpen}
            searchTerm={searchTerm}
            onRestoreFiles={onRestoreFiles}
          />
        </Block>
      </Content>
    </React.Fragment>
  );
};

export default RecycleBin;
