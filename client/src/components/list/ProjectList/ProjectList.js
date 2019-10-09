import React from 'react';
import styles from './ProjectList.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import ProjectItem from 'components/list/ProjectItem';

const cx = classNames.bind(styles);

const ProjectList = ({ projects }) => {
  const projectList = projects.map(
    (project) => {
      const { address, title, project_image, tags } = project.toJS();
      return (
        <ProjectItem
          title={title}
          project_image={project_image}
          address={address}
          tags={tags}
          key={address}
        />
      )
    }
  );

  return (
    <section id="services">
      <div className={cx('project-list')}>
        <div className={cx('container project-list')}>
          {/* header */}
          <div className={cx('header text-center')}>
            <h1><strong>Investments</strong></h1>
            <div className={cx('header-underline')}></div>
            <p className={cx('text-muted')}>투자 진행중인 프로젝트</p>
          </div>
          {/* end of header */}
          <div className={cx('row')}>
            {projectList}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectList;
