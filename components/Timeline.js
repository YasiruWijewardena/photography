import PropTypes from 'prop-types';
import React from 'react';
import '../styles/public/timeline.css';

export default function Timeline({ chapterPositions, progress, onChapterClick }) {
  // The total number of labels is the number of chapters plus one for the "End" label.
  const totalLabels = chapterPositions.length + 1;

  // Create an array of label objects.
  // For index 0 to totalLabels - 2, use the chapter title.
  // For the last label, use the word "End."
  const labels = chapterPositions.map((chapter, index) => ({
    id: chapter.chapterId,
    title: chapter.title,
    top: (index / (totalLabels - 1)) * 100,
  }));
  labels.push({
    id: 'end',
    title: 'End',
    top: 100,
  });

  return (
    <div className="timelineContainer">
      {/* Animated progress bar, its height corresponds to the scroll progress */}
      <div
        className="timelineProgress"
        style={{ height: `${progress}%` }}
      />
      {/* Render chapter labels (and the "End" label) evenly spaced */}
      {labels.map((label) => (
        <div
          key={label.id}
          className="timelineLabel"
          style={{ top: `${label.top}%` }}
          onClick={() => {
            // Only trigger chapter click for chapter labels (not the "End" label)
            if (label.id !== 'end') {
              onChapterClick(label.id);
            }
          }}
        >
          {label.title}
        </div>
      ))}
    </div>
  );
}

Timeline.propTypes = {
  // Expect an array of chapter objects that include an id and a title.
  chapterPositions: PropTypes.arrayOf(
    PropTypes.shape({
      chapterId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      // offsetPercent is no longer used for positioning in this version.
      offsetPercent: PropTypes.number,
    })
  ).isRequired,
  progress: PropTypes.number,
  onChapterClick: PropTypes.func.isRequired,
};

Timeline.defaultProps = {
  progress: 0,
};

export { Timeline };