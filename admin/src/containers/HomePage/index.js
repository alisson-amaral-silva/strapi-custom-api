/*
 *
 * HomePage
 *
 */
/* eslint-disable */
import { get, upperFirst } from 'lodash';
import React, { memo, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { auth, LoadingIndicatorPage } from 'strapi-helper-plugin';
import PageTitle from '../../components/PageTitle';
import { useModels } from '../../hooks';
import {
  ALink,
  Block,
  Container,
  LinkWrapper,
  P,
  Separator,
  Wave,
} from './components';
import useFetch from './hooks';
import SocialLink from './SocialLink';

const FIRST_BLOCK_LINKS = [
  {
    link:
      'https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html#_4-create-a-category-content-type',
    contentId: 'app.components.BlockLink.documentation.content',
    titleId: 'app.components.BlockLink.documentation',
  },
  {
    link: 'https://github.com/strapi/foodadvisor',
    contentId: 'app.components.BlockLink.code.content',
    titleId: 'app.components.BlockLink.code',
  },
];

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    link: 'https://github.com/alisson-amaral-silva',
  },
  {
    name: 'Twitter',
    link: 'https://twitter.com/TheNewestKillm1',
  },
];

const HomePage = ({ history: { push } }) => {
  const { error, isLoading, posts } = useFetch();
  // Temporary until we develop the menu API
  const {
    collectionTypes,
    singleTypes,
    isLoading: isLoadingForModels,
  } = useModels();

  const handleClick = (e) => {
    e.preventDefault();

    push(
      '/plugins/content-type-builder/content-types/plugins::users-permissions.user?modalType=contentType&kind=collectionType&actionType=create&settingType=base&forTarget=contentType&headerId=content-type-builder.modalForm.contentType.header-create&header_icon_isCustom_1=false&header_icon_name_1=contentType&header_label_1=null'
    );
  };

  const hasAlreadyCreatedContentTypes = useMemo(() => {
    const filterContentTypes = (contentTypes) =>
      contentTypes.filter((c) => c.isDisplayed);

    return (
      filterContentTypes(collectionTypes).length > 1 ||
      filterContentTypes(singleTypes).length > 0
    );
  }, [collectionTypes, singleTypes]);

  if (isLoadingForModels) {
    return <LoadingIndicatorPage />;
  }

  const headerId = hasAlreadyCreatedContentTypes
    ? 'HomePage.greetings'
    : 'app.components.HomePage.welcome';
  const username = get(auth.getUserInfo(), 'firstname', '');
  const linkProps = hasAlreadyCreatedContentTypes
    ? {
        id: 'app.components.HomePage.button.blog',
        href: 'https://strapi.io/blog/',
        onClick: () => {},
        type: 'blog',
        target: '_blank',
      }
    : {
        id: 'app.components.HomePage.create',
        href: '',
        onClick: handleClick,
        type: 'documentation',
      };

  return (
    <>
      <FormattedMessage id='HomePage.helmet.title'>
        {(title) => <PageTitle title={title} />}
      </FormattedMessage>
      <Container className='container-fluid'>
        <div className='row'>
          <div className='col-lg-8 col-md-12'>
            <Block>
              <Wave />
              <FormattedMessage
                id={headerId}
                values={{
                  name: upperFirst(username),
                }}
              >
                {(msg) => (
                  <h2 id='mainHeader'> Welcome to Wongames - Dashboard</h2>
                )}
              </FormattedMessage>
              <FormattedMessage id='app.components.HomePage.community.content'>
                {(content) => (
                  <P style={{ marginTop: 7, marginBottom: 0 }}>
                    Bem vindo à dashboard da WonGames, aqui você poderá
                    configurar diversas formas de exibição do conteudo da sua
                    página
                  </P>
                )}
              </FormattedMessage>
            </Block>
          </div>

          <div className='col-md-12 col-lg-4'>
            <Block style={{ paddingRight: 30, paddingBottom: 0 }}>
              <FormattedMessage id='HomePage.community'>
                {(msg) => <h2>Redes sociais do desenvolvedor</h2>}
              </FormattedMessage>
              <div
                className='row social-wrapper'
                style={{
                  display: 'flex',
                  margin: 0,
                  marginTop: 36,
                  marginLeft: -15,
                }}
              >
                {SOCIAL_LINKS.map((value, key) => (
                  <SocialLink key={key} {...value} />
                ))}
              </div>
            </Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);
