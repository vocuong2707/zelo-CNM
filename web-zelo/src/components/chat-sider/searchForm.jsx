import { Button, Col, Input, Row } from "antd";
import { CiSearch } from "react-icons/ci";
import { AiOutlineUserAdd, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useState } from "react";
import { ContactDialog } from "./contact-dialog";
import GroupDialog from "./group-dialog";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [openContact, setOpenContact] = useState(false)
  const [openCreatedGroup, setOpenCreatedGroup] = useState(false)
  const router = useNavigate()

  const avatarStyle = {
    margin: "10px 0px 0px 5px",
    border: "0px",
  };

  const handleOpenContact = () => setOpenContact(true)
  const handleCloseContact = () => setOpenContact(false)

  return (
    <Row>
      <Col span={15}>
        <Input
          size="middle"
          style={{ margin: "10px 10px 0px 10px" }}
          placeholder="search..."
          prefix={<CiSearch />}
        />
      </Col>
      <Col span={1}></Col>
      <Col span={4}>
        <Button type="text" style={avatarStyle} onClick={handleOpenContact}>
          <AiOutlineUserAdd size={20} />
        </Button>
      </Col>

      <Col span={4}>
        <Button type="text" style={avatarStyle} onClick={() => setOpenCreatedGroup(true)}>
          <AiOutlineUsergroupAdd size={20} />
        </Button>
      </Col>
      {openContact ? <ContactDialog open={openContact} onClose={handleCloseContact} /> : null}
      {openCreatedGroup ? <GroupDialog open={openCreatedGroup} onClose={() => {
        setOpenCreatedGroup(false)
        router("/home")
      }} /> : null}
    </Row>
  );
}

export default SearchForm;
