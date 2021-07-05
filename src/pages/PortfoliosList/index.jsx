import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Image } from 'antd';
import React, { useState }  from 'react';
import { FormattedMessage } from 'umi';
import { queryPortFolios } from './service.js'

const pageLimit = 10;

const PortfoliosList = () => {
  const [portfolios, setPorfolios] = useState([]);

  const handlePageChange = (val) => {
    queryPortFolios({type: 0, page: val > 0? val - 1: 0, limit: pageLimit}).then((resp) => {
      console.log(resp);
      setPorfolios(resp.data);
    });
  }
  const columns = [
    {
      title: <FormattedMessage id="pages.portofiles.id" defaultMessage="Id" />,
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
            {dom}
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
          <FormattedMessage id="pages.portofolios.delete" defaultMessage="delete" />
        </a>,
        <span>  </span>,
        <a key="update" href="https://procomponents.ant.design/">
          <FormattedMessage id="pages.portofolios.modify" defaultMessage="modify" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <Button>
        new portfolio
      </Button>
      <Table 
        dataSource={ portfolios }
        columns={columns}
        pagination={{ 
          position:['bottomRight'],
          pageSize: 10,
          total: 200,
          defaultCurrent: 1,
          onChange: handlePageChange,
        }}
      />
    </PageContainer>
  );
};
export default PortfoliosList;
