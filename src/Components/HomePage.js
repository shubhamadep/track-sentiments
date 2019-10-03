import React, {useState, useEffect} from 'react';
import { Container, Paper, Typography, InputBase, Button, Grid, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import DirectionsIcon from '@material-ui/icons/Directions';
import axios from 'axios'
import GaugeChart from 'react-gauge-chart'
import CircularProgress from '@material-ui/core/CircularProgress';
import {useSpring, animated} from 'react-spring'

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginTop: '50%',
      },
      input: {
        marginLeft: theme.spacing(1),
        flex: 1,
      },
      iconButton: {
        padding: 10,
      },
      divider: {
        height: 28,
        margin: 4,
      },
      AnalysisSection: {
        marginTop: '25px'
      },
      AnalysisSectionPaper: {
        height: '200px',
      },
      analysisBlock: {
          margin: '10px',
      }
}))
export default function HomePage() {
    const classes = useStyles()
    const [value, setValue] = useState('');
    const [sentimentScore, setSentimentScore] = useState(0)
    const [topWords, setTopWords] = useState('')
    const [gettingData, setGettingData] = useState(false)
    const [progress, setProgress] = React.useState(0);
    // const props = useSpring({ number: 86.50, from: { number: 0 } }) <animated.span>{props.number}</animated.span>
    
    async function getSentimentScore(){
      await axios.get('https://34.70.231.42/predict',{
                    params: {text: value},
                    headers: {"Access-Control-Allow-Origin": "*"}
                    })
            .then(res=> {
                    setSentimentScore(res['data']['sentiment_score'])
                    setTopWords(res['data']['top_words'])
                    setGettingData(false)
                }
                
            )
    }

    useEffect(() => {
        function tick() {
          // reset when reaching 100%
          setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
        }
    
        const timer = setInterval(tick, 20);
        return () => {
          clearInterval(timer);
        };
      }, []);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleGoClick = (e) => {
        setGettingData(true)
        getSentimentScore()
    }

    if(gettingData){
        return(
            <Container maxWidth="md">
                <div align="center">
                    <Paper className={classes.root} align="left" elevation='4'>
                            <InputBase
                                placeholder="https:// ..... "
                                className={classes.input}
                                inputProps={{ 'aria-label': 'naked' }}
                                onChange={handleChange}
                            />
                            <IconButton className={classes.iconButton} aria-label="search" align='right' onClick={handleGoClick}>
                                <DirectionsIcon />
                            </IconButton>
                    </Paper>
                    <Grid container className={classes.AnalysisSection}>
                        <Grid item xs={12} md={5} className={classes.analysisBlock}>
                            <Paper className={classes.AnalysisSectionPaper}>
                                <Typography variant='h4'>
                                    <CircularProgress className={classes.progress} variant="determinate" value={progress} />
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={5} className={classes.analysisBlock}>
                            <Paper className={classes.AnalysisSectionPaper}>
                                <Typography variant='h4'>
                                    <CircularProgress className={classes.progress} variant="determinate" value={progress} />
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        )       
    }else{
        return(
            <Container maxWidth="md">
                <div align="center">
                    <Paper className={classes.root} align="left" elevation='4'>
                            <InputBase
                                placeholder="https:// ..... "
                                className={classes.input}
                                inputProps={{ 'aria-label': 'naked' }}
                                onChange={handleChange}
                            />
                            <IconButton className={classes.iconButton} aria-label="search" align='right' onClick={handleGoClick}>
                                <DirectionsIcon />
                            </IconButton>
                    </Paper>
                    <Grid container className={classes.AnalysisSection}>
                        <Grid item xs={12} md={5} className={classes.analysisBlock}>
                            <Paper className={classes.AnalysisSectionPaper}>
                                <Typography variant="h6">Sentiment Score</Typography>
                                <GaugeChart id="gauge-chart6" 
                                    nrOfLevels={15} 
                                    percent={(Number(sentimentScore))}
                                    needleColor="#345243"
                                    textColor="black"
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={5} className={classes.analysisBlock}>
                            <Paper className={classes.AnalysisSectionPaper}>
                                <Typography variant="h6">Words used to describe this product</Typography>
                                {topWords.split(',').map(word => {
                                    return(
                                        <Typography variant='subtitle1'>{word}</Typography>
                                    )  
                                })}
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        )        
    }
}