import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../services/api';

function TimingMonitor() {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [timingData, setTimingData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    polling_interval: 5
  });
  const [error, setError] = useState(null);
  const [monitoringStatus, setMonitoringStatus] = useState({});

  useEffect(() => {
    loadConfigs();
  }, []);

  useEffect(() => {
    let intervalId;
    if (selectedConfig) {
      // Poll for timing data every 2 seconds
      intervalId = setInterval(() => {
        loadLatestTimingData(selectedConfig.id);
      }, 2000);
      
      // Load immediately
      loadLatestTimingData(selectedConfig.id);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedConfig]);

  const loadConfigs = async () => {
    try {
      const response = await api.get('/api/timing/configs');
      setConfigs(response.data);
      
      // Load status for each config
      response.data.forEach(config => {
        loadMonitoringStatus(config.id);
      });
    } catch (err) {
      setError('Failed to load timing monitor configurations');
      console.error(err);
    }
  };

  const loadMonitoringStatus = async (configId) => {
    try {
      const response = await api.get(`/api/timing/configs/${configId}/status`);
      setMonitoringStatus(prev => ({
        ...prev,
        [configId]: response.data
      }));
    } catch (err) {
      console.error('Failed to load monitoring status', err);
    }
  };

  const loadLatestTimingData = async (configId) => {
    try {
      const response = await api.get(`/api/timing/configs/${configId}/latest`);
      setTimingData(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setTimingData(null);
      } else {
        console.error('Failed to load timing data', err);
      }
    }
  };

  const handleCreateConfig = async () => {
    try {
      await api.post('/api/timing/configs', formData);
      setOpenDialog(false);
      setFormData({ name: '', url: '', polling_interval: 5 });
      loadConfigs();
    } catch (err) {
      setError('Failed to create timing monitor configuration');
      console.error(err);
    }
  };

  const handleStartMonitoring = async (configId) => {
    try {
      await api.post(`/api/timing/configs/${configId}/start`);
      loadMonitoringStatus(configId);
      if (selectedConfig?.id === configId) {
        loadLatestTimingData(configId);
      }
    } catch (err) {
      setError('Failed to start monitoring');
      console.error(err);
    }
  };

  const handleStopMonitoring = async (configId) => {
    try {
      await api.post(`/api/timing/configs/${configId}/stop`);
      loadMonitoringStatus(configId);
    } catch (err) {
      setError('Failed to stop monitoring');
      console.error(err);
    }
  };

  const handleDeleteConfig = async (configId) => {
    if (window.confirm('Are you sure you want to delete this timing monitor?')) {
      try {
        await api.delete(`/api/timing/configs/${configId}`);
        if (selectedConfig?.id === configId) {
          setSelectedConfig(null);
          setTimingData(null);
        }
        loadConfigs();
      } catch (err) {
        setError('Failed to delete timing monitor configuration');
        console.error(err);
      }
    }
  };

  const formatTime = (time) => {
    return time || '-';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Timing Monitor
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Timing Monitor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Timing Monitor Configurations */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Timing Monitors
            </Typography>
            {configs.map((config) => (
              <Paper
                key={config.id}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: 'pointer',
                  bgcolor: selectedConfig?.id === config.id ? 'action.selected' : 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setSelectedConfig(config)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="subtitle1">{config.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {config.url}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Poll every {config.polling_interval}s
                    </Typography>
                  </Box>
                  <Box>
                    {monitoringStatus[config.id]?.is_running ? (
                      <Chip label="Running" color="success" size="small" />
                    ) : (
                      <Chip label="Stopped" size="small" />
                    )}
                  </Box>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {monitoringStatus[config.id]?.is_running ? (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStopMonitoring(config.id);
                      }}
                    >
                      <StopIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartMonitoring(config.id);
                      }}
                    >
                      <PlayIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConfig(config.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
            {configs.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                No timing monitors configured
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Timing Data Display */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {selectedConfig ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {selectedConfig.name} - Live Timing
                  </Typography>
                  <IconButton
                    onClick={() => loadLatestTimingData(selectedConfig.id)}
                    size="small"
                  >
                    <RefreshIcon />
                  </IconButton>
                </Box>

                {timingData ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Race: {timingData.race_number || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {timingData.session_status || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Update: {new Date(timingData.timestamp).toLocaleString()}
                      </Typography>
                    </Box>

                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Pos</TableCell>
                            <TableCell>No.</TableCell>
                            <TableCell>Driver</TableCell>
                            <TableCell>Laps</TableCell>
                            <TableCell>Last Lap</TableCell>
                            <TableCell>Best Lap</TableCell>
                            <TableCell>Gap</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {timingData.timing_data && timingData.timing_data.map((driver, index) => (
                            <TableRow key={index}>
                              <TableCell>{driver.position || '-'}</TableCell>
                              <TableCell>{driver.driver_number || '-'}</TableCell>
                              <TableCell>{driver.driver_name}</TableCell>
                              <TableCell>{driver.laps_completed || 0}</TableCell>
                              <TableCell>{formatTime(driver.last_lap_time)}</TableCell>
                              <TableCell>{formatTime(driver.best_lap_time)}</TableCell>
                              <TableCell>{formatTime(driver.gap_to_leader)}</TableCell>
                              <TableCell>{driver.status || 'Running'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {(!timingData.timing_data || timingData.timing_data.length === 0) && (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                        No timing data available
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No timing data received yet. Make sure monitoring is started.
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                Select a timing monitor to view live timing data
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Timing Monitor</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            label="Timing Monitor URL"
            fullWidth
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            margin="normal"
            required
            placeholder="https://example.com/timing"
          />
          <TextField
            label="Polling Interval (seconds)"
            type="number"
            fullWidth
            value={formData.polling_interval}
            onChange={(e) => setFormData({ ...formData, polling_interval: parseInt(e.target.value) })}
            margin="normal"
            inputProps={{ min: 1, max: 60 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateConfig}
            variant="contained"
            disabled={!formData.name || !formData.url}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TimingMonitor;
