// components/Timeline.js

import PropTypes from 'prop-types';
import React from 'react';

export default function Timeline({ chapterPositions, progress, onChapterClick }) {
  return (
    <div className="timeline" style={styles.timelineContainer}>
      {/* Animated progress bar */}
      <div
        className="timeline-progress"
        style={{ ...styles.timelineProgress, height: `${progress}%` }}
      />
      {/* Render chapter labels absolutely positioned based on computed offsets */}
      {chapterPositions.map((pos) => (
        <div
          key={pos.chapterId}
          className="timeline-label"
          style={{ ...styles.timelineLabel, top: `${pos.offsetPercent}%` }}
          onClick={() => onChapterClick(pos.chapterId)}
        >
          {pos.title}
        </div>
      ))}
    </div>
  );
}

const styles = {
  timelineContainer: {
    position: 'sticky',
    top: '20px',
    width: '80px', // collapsed sidebar width
    padding: '5px',
    background: '#ffffff',
    borderRight: 'none', // remove border for a cleaner look
    height: '80vh',
    overflow: 'hidden',
    position: 'relative',
  },
  timelineProgress: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)', // Only translate horizontally
    top: 0,
    width: '3px',
    backgroundColor: '#000000',
    transition: 'height 0.3s ease-out',
    zIndex: 1,
  },
  timelineLabel: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)', // Remove vertical centering
    padding: '4px 8px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 2,
    fontSize: '15px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
};

Timeline.propTypes = {
  chapterPositions: PropTypes.arrayOf(
    PropTypes.shape({
      chapterId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      offsetPercent: PropTypes.number.isRequired,
    })
  ).isRequired,
  progress: PropTypes.number,
  onChapterClick: PropTypes.func.isRequired,
};

Timeline.defaultProps = {
  progress: 0,
};

export { Timeline };