/**
 * Component that filters on liked trails and sends a filtered trailObjects array to TrailContainer
 * It uses React redux to get:
 *  - All trails from 'trails'
 *  - Liked trails from 'like'
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
// Action imports from reducers
import { fetchTrails } from '../reducers/trails';
// Component imports
import { TrailContainer } from './TrailContainer';
import { NavBar } from './NavBar';
// Style imports
import '../styles/TrailContainer.css'
import { Loading } from './Loading';
import { Error } from './Error';

export const LikedTrailsContainer = () => {
    const dispatch = useDispatch();
    const [likedTrailObjects, setlikedTrailObjects] = useState([]);
    const [initialized, setInitialized] = useState(false)
    const likedTrails = useSelector((state) => state.like.likedList);
    const trails = useSelector((state) => state.trails);
    const stableDispatch = useCallback(dispatch, []);

    useEffect(() => { // This effect is used once during component mounting
      if(trails.trailObjects.length == 0) {
        console.log("No trailobjects: ", trails)
        stableDispatch(fetchTrails());
      }
      filterLikedTrails()
    }, [trails, stableDispatch, likedTrails])

    /**
     * Function that filter the original array based on which trails are liked 
     * */
    const filterLikedTrails = () => {
      const likedTrailObjects = trails.trailObjects.filter((trail) => {
        return likedTrails.some((like) => like.id === trail.id && like.isLiked)
      });
      //console.log(`Liked trails: `, likedTrailObjects)
      setlikedTrailObjects(likedTrailObjects);
    }

    return (
      <div className="liked-trails">
          <NavBar />
          {(trails.loading && <Loading />)}
          {(!trails.loading && trails.error ? <Error /> : null)}
          {(!trails.loading && trails.trailObjects.length ? <TrailContainer trailObjects={likedTrailObjects} /> : null)}
      </div>
    );
}

