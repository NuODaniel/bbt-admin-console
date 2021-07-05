import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Image } from 'antd';
import React  from 'react';
import { FormattedMessage } from 'umi';
import reqwest from 'reqwest';


const getRandomuserParams = params => ({
  limit: params.pagination.pageSize,
  page: params.pagination.current,
  type: params.type
});

class PortfoliosList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      type: 0,
      loading: false,
    };
  }
  componentDidMount() {
    const { pagination, type } = this.state;
    this.fetch({ pagination, type});
  }

  
  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:2582/bbt/portfolio',
      method: 'get',
      type: 'json',
      data: getRandomuserParams(params),
    }).then((resp) => {
      console.log(resp);
      this.setState({
        loading: false,
        data: resp.data,
        pagination: {
          ...params.pagination,
          total: 200,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });
    });
  };


  render = () => {
    const columns = [
      {
        title: <FormattedMessage id="pages.portofiles.id" defaultMessage="Id" />,
        dataIndex: 'id',
        render: (dom, entity) => {
          return (
            <a
              onClick={() => {
                // setCurrentRow(entity);
                // setShowDetail(true);
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
          dataSource={this.state.data}
          columns={columns}
          pagination={{ 
            position:['bottomRight'],
            pageSize: 10,
            total: this.state.total
          }}
           />
        <Button
          onClick={() => {
            console.log('click');
          }}
        ></Button>
      </PageContainer>
    );
  };
}
export default PortfoliosList;
