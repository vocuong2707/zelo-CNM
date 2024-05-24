import Sider from "antd/es/layout/Sider";
import SearchForm from "./searchForm";
import ChatSiderTabs from "./tabs";

const ChatSider = () => {
  const siderStyle = {
    color: "black",
    backgroundColor: "white",
    borderRight: "1px solid lightgray",
  };
  return (
    <Sider width={"20%"} style={siderStyle}>
      <SearchForm />
      <ChatSiderTabs />
    </Sider>
  );
};

export default ChatSider;
