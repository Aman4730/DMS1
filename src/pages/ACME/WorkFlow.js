import React, { useContext, useEffect, useState } from "react";
import { notification } from "antd";
import { useForm } from "react-hook-form";
import Head from "../../layout/head/Head";
import ModalPop from "../../components/Modal";
import SearchBar from "../../components/SearchBar";
import Content from "../../layout/content/Content";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../../context/UserContext";
import { AuthContext } from "../../context/AuthContext";
import {
  Autocomplete,
  Checkbox,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormGroup, Modal, ModalBody, Form } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Col,
  Button,
  RSelect,
} from "../../../src/components/Component";
import WorkFlowTable from "../../components/Tables/WorkFlowTable";
const WorkFlow = () => {
  const {
    contextData,
    getpolicy,
    userDropdownU,
    add_Policies,
    deletepolicy,
    getWorkspace,
  } = useContext(UserContext);
  const [sm, updateSm] = useState(false);
  const [editId, setEditedId] = useState();
  const [userData, setUserData] = contextData;
  const [deleteId, setDeleteId] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const { setAuthToken } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [onSearchText, setSearchText] = useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userDropdowns, setUserDropdowns] = useState([]);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [formData, setFormData] = useState({
    group_name: "",
    group_admin: "",
    selected_user: "",
  });
  const [addPolicies, setAddPolicies] = useState({
    policy_name: "",
    selected_user: [],
    selected_group: [],
    policy_type: "",
    minimum_characters: "",
    minimum_numeric: "",
    minimum_alphabet: "",
    minimum_special: "",
    incorrect_password: "",
    // file_extension: "",
    minimum_days: "",
    maximum_days: "",
    subject: "",
    message: "",
    minimum_upload: "",
    minimum_download: "",
  });
  const [checkboxValues, setCheckboxValues] = useState({
    view: false,
    enable: false,
    share: false,
    rename: false,
    upload_folder: false,
    create_folder: false,
    upload_file: false,
    delete: false,
    download: false,
    move: false,
    rights: false,
    comment: false,
    properties: false,
  });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));
  };
  const handleShareData = (e) => {
    const { name, value } = e.target;
    setAddPolicies((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [open, setOpen] = React.useState({
    status: false,
    data: "",
  });
  const handleClose = () => {
    resetForm();
    setEditedId(0);
    setOpen({ status: false });
  };
  const [deleteModal, setDeleteModal] = React.useState({
    status: false,
    data: "",
  });
  const handleClickOpen = (id) => {
    setDeleteModal({
      status: true,
      data: id,
    });
  };
  const handleCloseDelete = () => {
    setDeleteModal({
      status: false,
      data: "",
    });
  };
  useEffect(() => {
    let newData;
    newData = userData.map((item) => {
      item.checked = false;
      return item;
    });
    setUserData([...newData]);
  }, []);
  useEffect(() => {
    getRolesDropdown();
    getTableData();
  }, [currentPage]);
  useEffect(() => {
    getTableData();
  }, [addPolicies]);
  const getUserRselect = () => {
    userDropdownU(
      {},
      (apiRes) => {
        const data = apiRes.data;
        const code = apiRes.status;
        const message =
          apiRes.data.message[
            ({ value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" })
          ];
        setUserDropdowns(
          data.data.map((gro) => ({
            label: gro.email,
            value: gro.email,
          }))
        );
      },
      (apiErr) => {}
    );
  };

  const [userDropdown, setUserDropdown] = useState([]);

  const getRolesDropdown = () => {
    getWorkspace(
      {},
      (apiRes) => {
        const data = apiRes.data.data;
        setUserDropdown(
          data.map((gro) => ({
            label: gro.workspace_name,
            value: gro.id,
          }))
        );
      },
      (apiErr) => {}
    );
  };
  const [tableDropdown, setTableDropdown] = useState([]);
  const getTableData = () => {
    getpolicy(
      {},
      (apiRes) => {
        const data = apiRes.data.data2;
        setTableDropdown(data);
        setTotalUsers(apiRes.data.data2.length);
        // setGroupsDropdown(
        //   data.groups.map((gro) => ({
        //     label: gro.group_name,
        //     value: gro.id,
        //   }))
        // );
      },
      (apiErr) => {}
    );
  };
  useEffect(() => {
    getUserRselect();
  }, []);
  // function to reset the form
  const resetForm = () => {
    setAddPolicies({
      policy_name: "",
      selected_user: [],
      selected_group: [],
      policy_type: "",
      minimum_characters: "",
      minimum_numeric: "",
      minimum_alphabet: "",
      minimum_special: "",
      incorrect_password: "",
      // file_extension: "",
      minimum_days: "",
      maximum_days: "",
      subject: "",
      message: "",
      minimum_upload: "",
      minimum_download: "",
    });
    setEditedId(0);
  };
  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };
  // submit function to add a new item
  const onFormSubmit = () => {
    if (editId) {
      let submittedData = {
        id: editId,
        policy_name: addPolicies.policy_name,
        selected_user: addPolicies.selected_user,
        selected_group: addPolicies.selected_group,
        policy_type: addPolicies.policy_type,
        minimum_characters: addPolicies.minimum_characters,
        minimum_numeric: addPolicies.minimum_numeric,
        minimum_alphabet: addPolicies.minimum_alphabet,
        minimum_special: addPolicies.minimum_special,
        incorrect_password: addPolicies.incorrect_password,
        file_extension: todos,
        minimum_days: addPolicies.minimum_days,
        maximum_days: addPolicies.maximum_days,
        subject: addPolicies.subject,
        message: addPolicies.message,
        minimum_upload: addPolicies.minimum_upload,
        minimum_download: addPolicies.minimum_download,
        view: checkboxValues.view,
        enable: checkboxValues.enable,
        share: checkboxValues.share,
        rename: checkboxValues.rename,
        upload_folder: checkboxValues.upload_folder,
        create_folder: checkboxValues.create_folder,
        upload_file: checkboxValues.upload_file,
        delete: checkboxValues.delete,
        download: checkboxValues.download,
        move: checkboxValues.move,
        rights: checkboxValues.rights,
        comment: checkboxValues.comment,
        properties: checkboxValues.properties,
      };
      notification["success"]({
        placement: "top",
        description: "",
        message: "Edit Policy Successfully...",
        style: {
          marginTop: "43px",
          height: "60px",
        },
      });
      add_Policies(
        submittedData,
        (apiRes) => {
          const code = 200;
          if (code == 200) {
            resetForm();
            // setModal({ edit: false }, { add: false });
            setOpen({ ...open, status: false });
          }
          setAuthToken(token);
        },
        (apiErr) => {}
      );
    } else {
      let submittedData = {
        policy_name: addPolicies.policy_name,
        selected_user: addPolicies.selected_user,
        selected_group: addPolicies.selected_group,
        policy_type: addPolicies.policy_type,
        minimum_characters: addPolicies.minimum_characters,
        minimum_numeric: addPolicies.minimum_numeric,
        minimum_alphabet: addPolicies.minimum_alphabet,
        minimum_special: addPolicies.minimum_special,
        incorrect_password: addPolicies.incorrect_password,
        file_extension: todos,
        minimum_days: addPolicies.minimum_days,
        maximum_days: addPolicies.maximum_days,
        subject: addPolicies.subject,
        message: addPolicies.message,
        minimum_upload: addPolicies.minimum_upload,
        minimum_download: addPolicies.minimum_download,
        view: checkboxValues.view,
        share: checkboxValues.share,
        rename: checkboxValues.rename,
        enable: checkboxValues.enable,
        upload_folder: checkboxValues.upload_folder,
        create_folder: checkboxValues.create_folder,
        upload_file: checkboxValues.upload_file,
        delete: checkboxValues.delete,
        download: checkboxValues.download,
        move: checkboxValues.move,
        rights: checkboxValues.rights,
        comment: checkboxValues.comment,
        properties: checkboxValues.properties,
      };
      notification["success"]({
        placement: "top",
        description: "",
        message: "Group Created Successfully...",
        style: {
          marginTop: "43px",
          height: "60px",
        },
      });
      add_Policies(
        submittedData,
        (apiRes) => {
          const code = 200;
          if (code == 200) {
            resetForm();
            setOpen({ ...open, status: false });
            getUsers();
          }
          setAuthToken(token);
        },
        (apiErr) => {}
      );
    }
  };

  const onEditClick = (id) => {
    tableDropdown.map((item) => {
      if (item.id == id) {
        setAddPolicies({
          id: id,
          policy_name: item.policy_name,
          policy_type: item.policy_type,
          selected_user: item.selected_users,
          selected_group: item.selected_group,
          minimum_characters: item.minimum_character,
          minimum_numeric: item.minimum_numeric,
          minimum_alphabet: item.minimum_Alphabets,
          minimum_special: item.minimum_special_character,
          incorrect_password: item.inncorrect_password_attend,
          file_extension: todos,
          minimum_days: item.minimum_maximum_days[0],
          maximum_days: item.minimum_maximum_days[1],
          subject: item.subject,
          message: item.message,
          minimum_upload: item.Bandwidth_min_max[0],
          minimum_download: item.Bandwidth_min_max[1],
          view: item.view,
          share: item.share,
          rename: item.rename,
          upload_folder: item.upload_folder,
          enable: item.enable,
          create_folder: item.create_folder,
          upload_file: item.upload_file,
          delete: item.delete,
          download: item.download,
          move: item.move,
          rights: item.rights,
          comment: item.comment,
          properties: item.properties,
        });
        setOpen({ ...open, status: true });
        // setModal({ edit: false, add: true });
        setEditedId(id);
      }
    });
  };
  const onDeleteClick = (id) => {
    handleCloseDelete();
    notification["success"]({
      placement: "top",
      description: "",
      message: "WorkFlow Deleted Successfully...",
      style: {
        marginTop: "43px",
        height: "60px",
      },
    });
    setDeleteId(true);
    let deleteId = { id: id };
    deletepolicy(
      deleteId,
      (apiRes) => {
        const code = 200;
        if (code == 200) {
          resetForm();
          setModal({ edit: false }, { add: false });
        }
        setAuthToken(token);
      },
      (apiErr) => {}
    );
  };
  const tableHeader = [
    {
      id: "Policy Name",
      numeric: false,
      disablePadding: true,
      label: "Policy Name",
    },
    {
      id: "Policy Type",
      numeric: false,
      disablePadding: true,
      label: "Policy Type",
    },

    {
      id: "User Group",
      numeric: false,
      disablePadding: true,
      label: "User Group",
    },
    {
      id: "User",
      numeric: false,
      disablePadding: true,
      label: "User",
    },
    {
      id: "Updated By",
      numeric: false,
      disablePadding: true,
      label: "Updated By",
    },
    {
      id: "Action",
      numeric: false,
      disablePadding: true,
      label: "Action",
      style: { marginLeft: "18px" },
    },
  ];
  // todolist
  let [addProperty, setAddProperty] = useState("");
  let [todos, setTodos] = useState([]);
  const addTask = () => {
    setAddProperty("");
    setTodos([...todos, addProperty]);
  };
  const removeHandler = (id) => {
    let newTodos = todos.filter((ele, index) => index != id);
    setTodos(newTodos);
  };
  const editHandler = (id) => {
    setAddProperty(todos.filter((val, index) => index === id));
    removeHandler(id);
  };
  const access = [
    { label: "L1", name: "l1" },
    { label: "L2", name: "l2" },
    { label: "L3", name: "l3" },
    { label: "L4", name: "l4" },
  ];
  const { errors, register, handleSubmit, watch, triggerValidation } =
    useForm();

  return (
    <React.Fragment>
      {/* modal */}
      <ModalPop
        data={deleteModal.data}
        open={deleteModal.status}
        handleClose={handleCloseDelete}
        handleOkay={onDeleteClick}
        title="Policy is being Deleted. Are You Sure !"
      />
      <Head title="Work Flow List - Regular"></Head>
      <Content>
        <Stack style={{ marginTop: "-20px" }}>
          <BlockHead size="sm">
            <BlockBetween>
              <BlockHeadContent>
                <BlockTitle>Work Flow</BlockTitle>
                <BlockDes className="text-soft">
                  <p>You have total {totalUsers} work flow.</p>
                </BlockDes>
              </BlockHeadContent>
              <BlockHeadContent>
                <div className="toggle-wrap nk-block-tools-toggle">
                  <Button
                    className={`btn-icon btn-trigger toggle-expand mr-n1 ${
                      sm ? "active" : ""
                    }`}
                    onClick={() => updateSm(!sm)}
                  >
                    <Icon name="menu-alt-r"></Icon>
                  </Button>
                  <div
                    className="toggle-expand-content"
                    style={{ display: sm ? "block" : "none" }}
                  >
                    <ul className="nk-block-tools g-3">
                      <li className="nk-block-tools-opt">
                        <SearchBar
                          handleClick={() => setModal({ ...open, add: true })}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
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
          <WorkFlowTable
            headCells={tableHeader}
            searchTerm={searchTerm}
            onEditClick={onEditClick}
            allfolderlist={tableDropdown}
            handleClickOpen={handleClickOpen}
          />
        </Block>
        <Modal
          isOpen={modal.add}
          toggle={() => setModal({ add: true })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div>
              <h5 className="title">
                {editId ? "Update Policy" : "Add Policy"}
              </h5>
              <div>
                <Form
                  className="row gy-2 gx-2"
                  noValidate
                  // onSubmit={handleSubmit(onFormSubmit)}
                >
                  <Col md="6">
                    <FormGroup>
                      <TextField
                        className="form-control"
                        type="text"
                        size="small"
                        name="policys_name"
                        defaultValue={formData.group_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        label="Policys Name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.group_name && (
                        <span className="invalid">
                          {errors.group_name.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <Autocomplete
                      fullWidth
                      disablePortal
                      size="small"
                      id="Authentication"
                      options={userDropdown}
                      renderInput={(params) => (
                        <TextField {...params} label="WorkSpace Name" />
                      )}
                    />
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <TextField
                        size="small"
                        className="form-control"
                        name="group_admin"
                        defaultValue={formData.group_admin}
                        ref={register({ required: "This field is required" })}
                        minLength={10}
                        maxLength={10}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [e.target.name]: e.target.value,
                          })
                        }
                        label="Enter Group Admin"
                        required
                      />
                      {errors.group_admin && (
                        <span className="invalid">
                          {errors.group_admin.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <RSelect
                        options={userDropdowns}
                        name="add_group"
                        defaultValue="Please Select Groups"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            selected_user: e.label,
                            [e.label]: e.value,
                          })
                        }
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.selected_user && (
                        <span className="invalid">
                          {errors.selected_user.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Stack>
                    <Grid item xs={10} sx={{ mb: -2 }}>
                      <DialogTitle sx={{ ml: -3, mt: -2 }} fontSize="14px">
                        Aproval Levels
                      </DialogTitle>
                    </Grid>
                    <Stack flexDirection="row">
                      {access?.map((data, index) => (
                        <>
                          <Grid item key={data.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={data.name}
                                  checked={checkboxValues[data.name]}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={
                                <Typography
                                  variant="body2"
                                  style={{ fontSize: "15px" }}
                                >
                                  {data.label}
                                </Typography>
                              }
                              sx={{ mb: -1 }}
                              style={data.style}
                            />
                          </Grid>
                        </>
                      ))}
                    </Stack>
                  </Stack>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md">
                          Add
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={modal.edit}
          toggle={() => setModal({ edit: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update User</h5>
              <div className="mt-4"></div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default WorkFlow;
