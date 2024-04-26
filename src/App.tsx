import { Layout, Row, Col, Button, Spin, List, Checkbox, Input, Table } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);


function App() {
  const { account } = useWallet();  

  useEffect(() => {
    fetchRequest();
  }, [account?.address]);

  const [accountHasRequest, setAccountHasRequest] = useState<boolean>(false); //アカウントが寄付のリクエストを持つかどうか
  //接続したウォレットのリクエスト情報を格納する
  const [charityDescription, setCharityDescription] = useState("");
  const [minimumContribution, setMinimumContribution] = useState("");
  const [nowRequest, setNowRequest] = useState(true);
  const [owner, setOwner] = useState("");
  const [recipient, setRecipient] = useState("");
  const [value, setValue] = useState("");

  //アカウントが寄付のリクエストを持つかどうかを取得し、フラグを変更する
  const fetchRequest = async () => {
    if (!account) return [];
    // change this to be your module account address
    const moduleAddress = "0x709acdb9471938ee0f0a7d04cde2b3add05c91cc7ace10348e8dad349ce91169";
    try {
      const RequestResource = await aptos.getAccountResource(
        {
          accountAddress:account?.address,
          resourceType:`${moduleAddress}::message_v07::Charity`
        }
      );
      // console.log(RequestResource);
      // console.log(RequestResource.description);
      setCharityDescription(RequestResource.description);//取得したRequestからdescriptionを取得
      setMinimumContribution(RequestResource.minimum_contribution);
      setNowRequest(RequestResource.now_request);
      setOwner(RequestResource.owner);
      setRecipient(RequestResource.recipient);
      setValue(RequestResource.value);

      //フラグを更新
      setAccountHasRequest(true);
    } catch (e: any) {
      console.error("Error fetching request:", e);
      setAccountHasRequest(false);
    }
  };

  const dataSource = [
    {
      key: '1',
      field: 'Minimum Contribution',
      value: minimumContribution,
    },
    {
      key: '2',
      field: 'Request Active',
      value: nowRequest ? "Yes" : "No",
    },
    {
      key: '3',
      field: 'description',
      value: charityDescription,
    },
    {
      key: '4',
      field: 'Owner',
      value: owner,
    },
    {
      key: '5',
      field: 'Recipient',
      value: recipient,
    },
    {
      key: '6',
      field: 'Desired amount',
      value: value,
    },
  ];

  const columns = [
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Charity Protocol</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      {accountHasRequest && (
      <Row gutter={[0, 32]} style={{ marginTop: "2rem" }}>
        <Col span={16} offset={4}>
            <div style={{ background: "#f0f2f5", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <h2>You have a request:</h2>
                <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>
        </Col>
      </Row>
    )}
  </>
  );
}
export default App;