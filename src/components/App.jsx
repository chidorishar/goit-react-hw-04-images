import { useState, useEffect } from 'react';

import { ThreeCircles } from 'react-loader-spinner';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

import { pixabayAPI, searchOptions } from 'services/fetchImagesAPI';

import css from './App.module.css';

export function App() {
  const [searchQuery, setSearchQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [imagesData, setImagesData] = useState(null);
  const [imageDataToShowInModal, setImageDataToShowInModal] = useState(null);
  const [isWaitingForImages, setIsWaitingForImages] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsWaitingForImages(true);
      const { hits: response, totalHits } = await pixabayAPI(searchQuery, page);
      //there is new images in response
      if (response.length) {
        setImagesData(prevState => [...prevState, ...response]);
        setCanLoadMore(page < Math.ceil(totalHits / searchOptions.per_page));
      }
      setIsWaitingForImages(false);
    }

    searchQuery && fetchData();
  }, [searchQuery, page]);

  useEffect(() => {
    if (!imagesData?.length) return;

    //scroll to first of newly loaded images
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }, [imagesData]);

  function onSearchFormSubmit(searchQuery) {
    if (!searchQuery) return;

    setSearchQuery(searchQuery);
    setPage(1);
    setImagesData([]);
  }

  return (
    <div className={css.app}>
      <Searchbar onFormSubmitCallback={onSearchFormSubmit} />
      {imagesData?.length ? (
        <ImageGallery
          imagesData={imagesData}
          onImageClickCallback={setImageDataToShowInModal}
        />
      ) : null}
      {isWaitingForImages && (
        <ThreeCircles
          height="100"
          width="100"
          color="#4fa94d"
          middleCircleColor="#8c4da9"
          wrapperStyle={{ margin: '0 auto' }}
          visible={true}
          ariaLabel="three-circles-rotating"
        />
      )}
      {canLoadMore && imagesData?.length && (
        <Button clickHandler={() => setPage(prevState => prevState + 1)}>
          Load More
        </Button>
      )}

      {imageDataToShowInModal && (
        <Modal
          imageData={imageDataToShowInModal}
          closeModalCallback={() => setImageDataToShowInModal(null)}
        />
      )}
    </div>
  );
}
