import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Upload, Select, Button, Table, Image, PageHeader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryPortFolios } from './service.js';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { addPortFolio, deletePortFolio } from './service.js';

import './index.css';

const pageLimit = 10;
const typeMap = { 1: 'poster', 2: 'oil paint', 3: 'photography', 4: 'food' };
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
    queryPortFolios({ type: 0, page: val > 0 ? val - 1 : 0, limit: pageLimit }).then((resp) => {
      setPorfolios(resp.data);
    });
  };

  // 取消上传
  const handlerRemoveUploadFile = (file) => {
    setFileLists((file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      return newFileList;
    });
  };

  //截断自动上传
  const handleBeforeUploadFile = (file) => {
    console.log('handle before', file);
    console.log('fileList', fileList);

    //TODO DEBUG
    setFileLists([...fileList, file]);
    // 使用 beforeUpload 會失去在選擇圖片後馬上看到圖片的功能，因此利用FileReader方法來實現預覽效果
    return false;
  };

  //i18n
  const intl = useIntl();

  useEffect(() => {
    handlePageChange(0);
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="pages.portfolios.id" defaultMessage="Id" />,
      dataIndex: 'id',
      render: (dom, entity) => {
        return <p>{dom}</p>;
      },
    },
    {
      title: <FormattedMessage id="pages.portfolios.title" defaultMessage="Title" />,
      dataIndex: 'title',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.portfolios.desc" defaultMessage="Description" />,
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: <FormattedMessage id="pages.portfolios.type" defaultMessage="Type" />,
      dataIndex: 'type',
      render: (val) => {
        return typeMap[val];
      },
    },
    {
      title: <FormattedMessage id="pages.portfolios.image" defaultMessage="Image" />,
      render: (val) => {
        return <Image width={200} src={val} />;
      },
      dataIndex: 'url',
    },
    {
      title: <FormattedMessage id="pages.portfolios.operations" defaultMessage="Operations" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="delete"
          onClick={async () => {
            console.log(record);
            const resp = await deletePortFolio({ id: record.id });
            console.log('delete work resp:', resp);
            if (resp.errCode == 0) {
              handlePageChange(0);
            } else {
              alert(resp.msg);
            }
          }}
        >
          <FormattedMessage id="pages.portfolios.delete" defaultMessage="delete" />
        </a>,
        // <span>  </span>,
        // <a key="update" href="https://procomponents.ant.design/">
        //   <FormattedMessage id="pages.portofolios.modify" defaultMessage="modify" />
        // </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <div className="site_wrapper">
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            handleModalVisible(true);
          }}
        >
          <PlusOutlined /> <FormattedMessage id="pages.portfolios.new" defaultMessage="New" />
        </Button>
      </div>
      <Table rowKey={(record) => record.id} dataSource={portfolios} columns={columns} />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.portfolios.newPortfolio',
          defaultMessage: 'New Portfolio',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          console.log(value);
          const formData = new FormData();
          Object.keys(value).forEach((key) => {
            if (key != 'file') {
              formData.append(key, value[key]);
            } else {
              fileList.forEach((file) => {
                formData.append('file', file);
              });
            }
          });
          console.log(formData);
          const resp = await addPortFolio(formData);

          console.log('add work resp:', resp);
          if (resp.errCode == 0) {
            handleModalVisible(false);
            handlePageChange(0);
          } else {
            alert(resp.msg);
          }
        }}
      >
        <Form.Item
          name="type"
          label={intl.formatMessage({
            id: 'pages.portfolios.type',
            defaultMessage: 'type',
          })}
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
            <Option value={'1'}>
              {intl.formatMessage({
                id: 'pages.portfolios.poster',
                defaultMessage: 'poster',
              })}
            </Option>
            <Option value={'2'}>
              {intl.formatMessage({
                id: 'pages.portfolios.oilpaint',
                defaultMessage: 'oil paint',
              })}
            </Option>
            <Option value={'3'}>
              {intl.formatMessage({
                id: 'pages.portfolios.photography',
                defaultMessage: 'photography',
              })}
            </Option>
            <Option value={'4'}>
              {intl.formatMessage({
                id: 'pages.portfolios.food',
                defaultMessage: 'food',
              })}
            </Option>
          </Select>
        </Form.Item>

        <ProFormText width="md" placeholder="enter a title" name="title" />

        <ProFormTextArea width="md" placeholder="enter a description" name="desc" />
        <Form.Item name="file" label="Upload">
          <Upload name="file" listType="picture" beforeUpload={handleBeforeUploadFile}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </ModalForm>
    </PageContainer>
  );
};
export default PortfoliosList;
