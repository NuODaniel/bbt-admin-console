import { PageContainer  } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload, Select, Button, Table, Image, PageHeader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState,useEffect  }  from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryPortFolios } from './service.js';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { addPortFolio } from './service.js'


import "./index.css";

const pageLimit = 10;

const PortfoliosList = () => {

  const { Option } = Select;
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState(false);
  
  const [fileList, setFileLists] = useState([]);


  const [portfolios, setPorfolios] = useState([]);

  //翻页
  const handlePageChange = (val) => {
    queryPortFolios({type: 0, page: val > 0? val - 1: 0, limit: pageLimit}).then((resp) => {
      setPorfolios(resp.data);
    });
  }

  //截断自动上传
  const handleBeforeUploadFile = (file) => {
    console.log("handle before", file)
    console.log("fileList", fileList)
    
    //TODO DEBUG
    setFileLists([file])
    // 使用 beforeUpload 會失去在選擇圖片後馬上看到圖片的功能，因此利用FileReader方法來實現預覽效果
    return false
  };

  //i18n
  const intl = useIntl();

  useEffect(() => {
    handlePageChange(0);
  }, [])
  const columns = [
    {
      title: <FormattedMessage id="pages.portofiles.id" defaultMessage="Id" />,
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
            <p>{dom}</p>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.portofiles.title" defaultMessage="Title" />,
      dataIndex: 'title',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.portofiles.desc" defaultMessage="Description" />,
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.portofiles.type" defaultMessage="Type" />,
      dataIndex: 'type',
      hideInForm: true,
      valueEnum: {
        1: {
          text: <FormattedMessage id="pages.portofiles.id.poster" defaultMessage="poster" />,
          status: 'poster',
        },
        2: {
          text: <FormattedMessage id="pages.portofiles.id.oilpaint" defaultMessage="oilpaint" />,
          status: 'oilpaint',
        },
        3: {
          text: <FormattedMessage id="pages.portofiles.id.photography" defaultMessage="food" />,
          status: 'photography',
        },
        4: {
          text: <FormattedMessage id="pages.portofiles.id.food" defaultMessage="food" />,
          status: 'food',
        },
      },
    },
    {
      title: <FormattedMessage id="pages.portofiles.url" defaultMessage="Url" />,
      render: (val) => {
        return <Image width={200} src={val} />;
      },
      dataIndex: 'url',
    },
    {
      title: <FormattedMessage id="pages.portofolios.titleOption" defaultMessage="operations" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.portfolios.delete" defaultMessage="delete" />
        </a>,
        <span>  </span>,
        <a key="update" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.portofolios.modify" defaultMessage="modify" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer >
      <PageHeader
        title="Portfolios"
        className="site_wrapper"
        >
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            handleModalVisible(true);
          }}
        >
          <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
        </Button>
      </PageHeader>
      <Table 
        dataSource={ portfolios }
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.portfolioList.newPortfolio',
          defaultMessage: 'New Portfolio',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          console.log(value);
          const formData = new FormData();
          Object.keys(value).forEach(key => formData.append(key, value[key]));
          console.log(formData);
          const success = await addPortFolio(formData);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <Form.Item
          name="type"
          label="portfolio type"
          hasFeedback
          rules={[{ required: true, message: 'Please select work type!' }]}
        >
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a type"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value={1}>poster</Option>
            <Option value={2}>oilpaint</Option>
            <Option value={3}>photography</Option>
            <Option value={4}>food</Option>
          </Select>
        </Form.Item>

        <ProFormText
          width="md"
          placeholder="enter a title"
          name="title"
        />

        <ProFormTextArea
          width="md"
          placeholder="enter a description"
          name="desc" />
        <Form.Item
          name="file"
          label="Upload"
          >
          <Upload
            name="file"
            listType="picture"
            beforeUpload={handleBeforeUploadFile}
            >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </ModalForm>
    </PageContainer>
  );
};
export default PortfoliosList;
