import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Input, Table } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { queryPortFolios } from './service';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

class PortfoliosList extends React.Component {
  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  render = () => {
    const actionRef = useRef();
    /**
     * @en-US The pop-up window of the distribution update window
     * @zh-CN 分布更新窗口的弹窗
     * */

    const [handleUpdateModalVisible] = useState(false);
    const [setShowDetail] = useState(false);
    const [setCurrentRow] = useState();
    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */

    fetch = (params = {}) => {
      this.setState({ loading: true });
      reqwest({
        url: 'http://localhost:2582/bbt/portfolios?type=0',
        method: 'get',
        type: 'json',
        data: getRandomuserParams(params),
      }).then((data) => {
        console.log(data);
        this.setState({
          loading: false,
          data: data.results,
          pagination: {
            ...params.pagination,
            total: 200,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
    };

    const intl = useIntl();
    const columns = [
      {
        title: <FormattedMessage id="pages.portofiles.id" defaultMessage="Id" />,
        dataIndex: 'id',
        render: (dom, entity) => {
          return (
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
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
          <a key="update" href="https://procomponents.ant.design/">
            <FormattedMessage id="pages.portofolios.modify" defaultMessage="modify" />
          </a>,
        ],
      },
    ];
    return (
      <PageContainer>
        <Table columns={columns} />
        <Button
          onClick={() => {
            console.log('click');
            actionRef.current?.reload();
          }}
        ></Button>
      </PageContainer>
    );
  };
}
export default PortfoliosList;
