import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MemoryIcon from '@mui/icons-material/Memory';
import CategoryIcon from '@mui/icons-material/Category';
import DeveloperSettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PublicIcon from '@mui/icons-material/Public';
import DnsIcon from '@mui/icons-material/Dns';

const CodeBlock = ({ children }) => (
  <Paper
    elevation={0}
    sx={{
      backgroundColor: 'grey.100',
      padding: 2,
      my: 2,
      overflowX: 'auto',
      fontFamily: 'monospace',
      whiteSpace: 'pre',
    }}
  >
    <code>{children}</code>
  </Paper>
);

const GettingStarted = () => {
  const userRoles = [
    { role: '🏆 SuperAdmin', access: 'Full Access', abilities: 'Manage everything (users, machines, models)', restricted: 'None' },
    { role: '🛠️ Admin', access: 'High', abilities: 'Configure Machines, Variants, and Models', restricted: 'User Management' },
    { role: '📋 Manager', access: 'Medium', abilities: 'Adjust operational parameters', restricted: 'Creation / Deletion' },
    { role: '👀 User', access: 'Read-only', abilities: 'View dashboards and machine status', restricted: 'All edit actions' },
  ];

  const deletionInfo = [
      { entity: '🖥️ Machine', location: 'Developer Settings → Machines', effect: 'Removes machine + camera, keeps variants/models' },
      { entity: '🍪 Variant', location: 'Developer Settings → Variants', effect: 'Deletes variant, keeps ML Models (orphaned)' },
      { entity: '🧠 ML Model', location: 'Developer Settings → Models', effect: 'Can’t delete if currently active' },
  ];

  const recapInfo = [
      { task: 'Monitor machines', location: '🏠 Home', role: 'Any' },
      { task: 'View performance', location: '📊 Dashboard', role: 'Any' },
      { task: 'Add or edit configurations', location: '⚙️ Developer Settings', role: 'Admin / SuperAdmin' },
      { task: 'Assign variants or models', location: '⚙️ Developer Settings', role: 'Admin / SuperAdmin' },
      { task: 'Delete entities', location: '⚙️ Developer Settings', role: 'SuperAdmin' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.dark' }}>
          Welcome to PackPatrol
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Your guide to managing and monitoring AI-powered industrial inspection machines.
        </Typography>
      </Box>
      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" component="h2" gutterBottom id="toc" sx={{ color:'#062249', fontWeight: 600 }}>
        🧭 Table of Contents
      </Typography>
      <List dense>
        <ListItem>1.&nbsp;<Link href="#core-concepts">Core Concepts</Link></ListItem>
        <ListItem>2.&nbsp;<Link href="#how-changes-work">How Changes Work</Link></ListItem>
        <ListItem>3.&nbsp;<Link href="#user-roles">User Roles & Access</Link></ListItem>
        <ListItem>4.&nbsp;<Link href="#app-pages">Application Pages</Link></ListItem>
        <ListItem>5.&nbsp;<Link href="#key-workflows">Key Workflows</Link></ListItem>
        <ListItem>6.&nbsp;<Link href="#recap">Quick Recap</Link></ListItem>
      </List>
      <Divider sx={{ my: 4 }} />

      <Box component="section" id="core-concepts" sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#062249', fontWeight: 600 }} id="core-concepts--relationships">
          🧩 Core Concepts & Relationships
        </Typography>
        <Typography variant='p' sx={{ mb: 0, ml:2 }}>PackPatrol revolves around three entities: <strong>Machines</strong>, <strong>Variants</strong>, and <strong>ML Models</strong>.</Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>🖥️ Machine</Typography>
                <Typography variant='p' sx={{ mb: 0}}>The <strong>hardware</strong> performing inspections. Each has a camera and links to one or more Variants.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>🍪 Variant</Typography>
                <Typography variant='p' sx={{ mb: 0}}>A <strong>product type</strong> to inspect (e.g., "Chocolate Chip Cookie"). It uses ML Models to find defects.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>🧠 ML Model</Typography>
                <Typography variant='p' sx={{ mb: 0}}>The <strong>AI “brain”</strong> that identifies defects for a specific Variant. Models have versions and thresholds.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 4 }}>🔗 Data Relationships</Typography>
        <CodeBlock>
{`┌──────────┐       ┌─────────┐       ┌──────────┐
| Machine  | M   M | Variant | 1   M | ML Model |
|----------|-------|---------|-------|----------|
| - name   |       | - name  |       | - name   |
| - camera |       | - type  |       | - version|
└──────────┘       └─────────┘       └──────────┘`}
        </CodeBlock>
        <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>🔸 Machine ↔ Variant (Many-to-Many)</Typography>
                <List dense>
                    <ListItem><ListItemText primary="One Machine can inspect multiple Variants." /></ListItem>
                    <ListItem><ListItemText primary="One Variant can be inspected by multiple Machines." /></ListItem>
                </List>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>🔸 Variant ↔ ML Model (One-to-Many)</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Each Variant can have multiple ML Models (e.g., different versions)." /></ListItem>
                    <ListItem><ListItemText primary="Only one model can be active for a Variant at a time." /></ListItem>
                </List>
            </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 4 }} />

      <Box component="section" id="how-changes-work" sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#062249', fontWeight: 600 }} id="understanding-how-changes-work">
          🌍 Understanding How Changes Work
        </Typography>
        <Typography paragraph>It's important to know which changes are global (affecting all machines) and which are specific to one machine.</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  GLOBAL Change
                </Typography>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>🍪 Variant (Product Type)</Typography>
                <Typography paragraph sx={{ mt: 1, color: 'text.secondary' }}>
                  If you edit a Variant's name or description, it changes <b>everywhere</b>.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  <b>Example:</b> Renaming "Chocolate Chip Cookie" to "Choco-Chip Delight" updates it for all machines using that variant.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Box sx={{ bgcolor: 'warning.dark', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DnsIcon />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  MACHINE-SPECIFIC Change
                </Typography>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}><TuneIcon sx={{ verticalAlign: 'bottom', mr: 0.5 }}/> Settings</Typography>
                <Typography paragraph sx={{ mt: 1, color: 'text.secondary' }}>
                  Settings like detection sensitivity (threshold) can be different for each machine, even if they are inspecting the same product.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  <b>Example:</b> Machine A can have a threshold of 0.8, while Machine B uses 0.9 for the same product.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Box sx={{ bgcolor: 'primary.dark', color: 'white', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon />
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  GLOBAL & SPECIFIC
                </Typography>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>🧠 ML Model (AI Brain)</Typography>
                <Typography paragraph sx={{ mt: 1, color: 'text.secondary' }}>
                  Model files are <b>global</b>, but which model a machine uses is <b>machine-specific</b>.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  <b>Example:</b> Updating `v2.onnx` affects all machines using it. However, Machine A can use `Model-v1` while Machine B uses `Model-v2` for the same product.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Divider sx={{ my: 4 }} />

      <Box component="section" id="user-roles" sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#062249', fontWeight: 600 }} id="user-roles--access-control">
          👥 User Roles & Access Control
        </Typography>
        <Typography variant='p' sx={{ mb: 0, ml:2 }}>PackPatrol uses a <strong>tiered role system</strong> to manage permissions.</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Role</TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Access Level</TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Key Abilities</TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Restricted Areas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRoles.map((row) => (
                <TableRow key={row.role}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600}}>{row.role}</TableCell>
                  <TableCell>{row.access}</TableCell>
                  <TableCell>{row.abilities}</TableCell>
                  <TableCell>{row.restricted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" sx={{ mt: 1 }}>💡 <strong>Tip:</strong> You can verify your access level on your profile dropdown in the app.</Typography>
      </Box>
      <Divider sx={{ my: 4 }} />

      <Box component="section" id="app-pages" sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#062249', fontWeight: 600 }} id="application-pages-overview">
          📱 Application Pages Overview
        </Typography>
        <Box sx={{ mt: 3 }}>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><HomeIcon sx={{ mr: 1 }} /> <Typography fontWeight="500">Home Page</Typography></AccordionSummary>
                <AccordionDetails>
                    <Typography variant='p' sx={{ mb: 0, ml:2 }}>The <strong>command center</strong> for real-time monitoring.</Typography>
                    <List dense>
                        <ListItem><ListItemText primary="🎥 Live Feed: Watch AI detection in action." /></ListItem>
                        <ListItem><ListItemText primary="📊 Real-time Stats: See stack counts and rejected/passed items." /></ListItem>
                        <ListItem><ListItemText primary="🕹️ Control Panel: Start/stop inspection and adjust parameters." /></ListItem>
                        <ListItem><ListItemText primary="🪵 Log Feed: View a stream of system updates and alerts." /></ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><DashboardIcon sx={{ mr: 1 }} /> <Typography fontWeight="500">Dashboard Page</Typography></AccordionSummary>
                <AccordionDetails>
                    <Typography variant='p' sx={{ mb: 0, ml:2 }}>Focuses on <strong>analytics and performance trends</strong>.</Typography>
                    <List dense>
                        <ListItem><ListItemText primary="📈 View production insights by machine or variant." /></ListItem>
                        <ListItem><ListItemText primary="📉 Visualize defect trends over time." /></ListItem>
                        <ListItem><ListItemText primary="📅 Filter data by a flexible date range." /></ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><MemoryIcon sx={{ mr: 1 }} /> <Typography fontWeight="500">Machine Details Page</Typography></AccordionSummary>
                <AccordionDetails>
                    <Typography variant='p' sx={{ mb: 0, ml:2 }}>Drill down into a specific machine's configuration and linked variants.</Typography>
                    <List dense>
                        <ListItem><ListItemText primary="ℹ️ See machine status and configuration details." /></ListItem>
                        <ListItem><ListItemText primary="🍪 View a list of all variants linked to the machine." /></ListItem>
                        <ListItem><ListItemText primary="📊 Get quick summary stats for each variant." /></ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}><ImageSearchIcon sx={{ mr: 1 }} /> <Typography fontWeight="500">Variant Gallery</Typography></AccordionSummary>
                <AccordionDetails>
                    <Typography variant='p' sx={{ mb: 0, ml:2 }}>Review image-level inspection results for a variant.</Typography>
                    <List dense>
                        <ListItem><ListItemText primary="🖼️ Browse a paginated grid of inspection images." /></ListItem>
                        <ListItem><ListItemText primary="🎨 Images are color-coded: 🟩 Accepted or 🟥 Rejected." /></ListItem>
                        <ListItem><ListItemText primary="🖱️ Click an image to view it full-screen with metadata." /></ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />

      <Box component="section" id="key-workflows" sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#062249', fontWeight: 600 }}>
          ⚡ Key Workflows
        </Typography>
        <Typography variant='p' sx={{ mb: 0, ml:2 }}>🧑‍💼 All entity management happens under the <strong>Developer Settings</strong> page (`/dev-settings`).</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h3" gutterBottom>🏗️ Creating a New Machine</Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>Go to <strong>Developer Settings → Add Machine</strong></li>
            <li>Fill out the required fields:
              <List dense>
                <ListItem><ListItemText primary="Variant info" /></ListItem>
                <ListItem><ListItemText primary="ML Model details" /></ListItem>
                <ListItem><ListItemText primary="Machine & Camera setup" /></ListItem>
              </List>
            </li>
            <li>Submit — the system links all 4 entities automatically!</li>
          </ol>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>⚠️ <strong>Naming Convention:</strong> Avoid spaces or special characters. Use `-` or `_`. <br/>&nbsp;&nbsp;&nbsp;&nbsp; ✅ <b>Example:</b> `Chocolates-Chip-v1` <br/> &nbsp;&nbsp;&nbsp;&nbsp; ❌ <b>Example:</b> `Chocolate's Chip v1`</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h3" gutterBottom>🍪 Creating a New Variant</Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>Developer Settings → <strong>Add Variant</strong></li>
            <li>Provide:
              <List dense>
                <ListItem><ListItemText primary="Variant details" /></ListItem>
                <ListItem><ListItemText primary="Initial ML Model + upload file" /></ListItem>
              </List>
            </li>
            <li>Submit → Variant appears in sidebar</li>
          </ol>
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h3" gutterBottom>🔁 Assign Existing Variant to Machine</Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>Developer Settings → Select a Machine → <strong>Edit</strong></li>
            <li>Check the box for <strong>“Add/Select Existing Variant”</strong>.</li>
            <li>Select the desired variant from the dropdown.</li>
            <li><strong>Important:</strong> You must also select which ML Model this machine will use for that variant.</li>
            <li>Confirm and save.</li>
          </ol>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            This allows different machines to use different model versions (e.g., `v1` vs. `v2`) for the same product.
          </Typography>
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h3" gutterBottom>🗑️ Deleting Entities (Use Caution!)</Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Entity</TableCell>
                <TableCell  component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Location</TableCell>
                <TableCell  component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Effect</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deletionInfo.map((row) => (
                <TableRow key={row.entity}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600}}>{row.entity}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.effect}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h3" gutterBottom>⚠️ Important Deletion Notes</Typography>
        <Typography variant="h6" component="h4">🧬 Orphaned ML Models</Typography>
        <Typography variant='p' sx={{ mb: 0, ml:2 }}>Models from deleted variants remain available to:</Typography>
        <List dense>
            <ListItem><ListItemText primary="🔄 Reassign later" /></ListItem>
            <ListItem><ListItemText primary="📚 Keep for record" /></ListItem>
            <ListItem><ListItemText primary="🗑️ Delete manually if unneeded" /></ListItem>
        </List>

        <Typography variant="h6" component="h4">🛡️ Active Model Protection</Typography>
        <Typography variant='p' sx={{ mb: 0, ml:2 }}>Active models can’t be deleted until replaced:</Typography>
        <Typography variant="body1" component="div">
          <ol>
            <li>Edit the variant → Assign another model</li>
            <li>Save changes</li>
            <li>Delete the inactive one safely</li>
          </ol>
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />

      <Box component="section" id="recap" sx={{ my: 4, pb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#062249', fontWeight: 600 }}>
          🧠 Quick Recap
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>You Want To...</TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Go To</TableCell>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '1rem' }}>Role Needed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recapInfo.map((row) => (
                <TableRow key={row.task}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600}}>{row.task}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default GettingStarted;