import PropTypes from 'prop-types';
import { useEffect } from 'react';
import css from './Modal.module.css';

export function Modal({
  closeModalCallback,
  imageData: { largeImageURL, id: imageID },
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === 'Escape') closeModalCallback();
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeModalCallback]);

  return (
    <div
      className={css.overlay}
      onClick={e => e.target === e.currentTarget && closeModalCallback()}
    >
      <div className={css.modal}>
        <img src={largeImageURL} alt={`id: ${imageID}`} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  imageData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
  closeModalCallback: PropTypes.func.isRequired,
};
