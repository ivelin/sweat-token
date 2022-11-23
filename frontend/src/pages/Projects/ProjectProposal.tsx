import { useState } from 'react'
import { ethers } from 'ethers'
import { useAccount, useContractRead } from 'wagmi'
import { addresses } from '../../constants/addresses'
import KALIDAO_ABI from '../../abi/KaliDAO.json'
import { useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem, Typography, Alert, CircularProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import Web3SubmitDialog from '../../components/Web3SubmitDialog'
import { useGetDAO } from '../../graph/getDAO'
import { ErrorMessage } from '@hookform/error-message'
import ReactMarkdown from 'react-markdown'

export default function ProjectProposal() {
  const { chainId, daoId } = useParams()

  // Web3SubmitDialog state vars
  const [dialogOpen, setDialogOpen] = useState(false)

  const [txInput, setTxInput] = useState({})
  const { address: userAddress, isConnected } = useAccount()
  const [proposedManagerAddress, setProposedManagerAddress] = useState(isConnected ? userAddress : '')

  const cid = Number(chainId)
  const pmContractAddress = addresses[cid]['extensions']['projectmanagement']
  const defaultDeadline = new Date() // Now
  defaultDeadline.setDate(defaultDeadline.getDate() + 30) // Set now + 30 days as the new date
  const {
    register,
    formState: { errors: formErrors },
    watch,
    handleSubmit
  } = useForm({
    defaultValues: {
      manager: proposedManagerAddress,
      budget: 0,
      deadline: defaultDeadline.toISOString().split('T')[0],
      goalTitle: '',
      goalDescription: '',
      goalLink: ''
    }
  })

  const watchGoalDescription = watch('goalDescription')

  const { data: myDao, isSuccess: isMyDaoLoaded } = useGetDAO(cid, daoId)

  const daoContract = {
    addressOrName: daoId || '',
    chainId: cid,
    contractInterface: KALIDAO_ABI
  }

  const contractReadExtensionResult = useContractRead({
    ...daoContract,
    functionName: 'extensions',
    args: [pmContractAddress]
  })

  const contractReadManagerResult = useContractRead({
    ...daoContract,
    functionName: 'balanceOf',
    args: [proposedManagerAddress],
    onError(error) {
      console.warn('Error reading default manager balance', { proposedManagerAddress, error })
    }
  })

  const onFormError = (errors: any, event: any) => {
    console.info({ errors, event })
  }

  const onSubmit = async (data: any, e: any) => {
    console.debug({ data })
    const { manager, budget, deadline, goalTitle, goalDescription, goalLink } = data
    setProposedManagerAddress(manager)
    try {
      await contractReadManagerResult.refetch({
        throwOnError: true,
        cancelRefetch: true
      })
    } catch (refetchError) {
      console.error({ refetchError })
      return
    }
    if (contractReadManagerResult.isError || contractReadManagerResult.isLoading) return

    const goals = [{ goalTitle, goalLink, goalDescription }]
    const goalString = JSON.stringify(goals)
    const milliseconds = new Date(deadline).getTime()
    const dateInSecs = Math.floor(milliseconds / 1000)
    const abiCoder = ethers.utils.defaultAbiCoder
    const payload = abiCoder.encode(
      ['uint256', 'address', 'uint256', 'uint256', 'string'],
      [0, manager, ethers.utils.parseEther(budget), dateInSecs, goalString]
    )

    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
    const PROPOSAL_TYPE_EXTENSION = 9

    const pmExtensionEnabled = await contractReadExtensionResult.refetch()

    // if PM extension is not enabled yet, toggle it on
    const TOGGLE_EXTENSION_AVAILABILITY = pmExtensionEnabled ? 0 : 1

    let description = 'New Project Proposal'
    goals.forEach(
      (goal) => (description = [description, `Goal: ${goal.goalTitle}`, `Goal Tracking Link: ${goalLink}`].join('.\n'))
    )
    description = [
      description,
      `Manager: ${manager}`,
      `Budget: ${budget}`,
      `Deadline: ${new Date(deadline).toUTCString()}`
    ].join('.\n')
    const txInput = {
      ...daoContract,
      functionName: 'propose',
      args: [PROPOSAL_TYPE_EXTENSION, description, [pmContractAddress], [TOGGLE_EXTENSION_AVAILABILITY], [payload]]
    }

    setDialogOpen(true)
    setTxInput(txInput)
  }

  const onDialogClose = async () => {
    setDialogOpen(false)
  }

  return (
    <Box
      sx={{
        maxWidth: 600
      }}
    >
      {isMyDaoLoaded && (
        <Alert severity="info">
          Propose a new project for DAO
          <div>
            <Typography variant="h5" component="div">
              {myDao?.token?.name} ({myDao?.token?.symbol})
            </Typography>
          </div>
        </Alert>
      )}
      <List component="form" onSubmit={handleSubmit(onSubmit, onFormError)}>
        <ListItem>
          <TextField
            id="manager"
            data-testid="manager"
            label="Manager"
            helperText="ETH L1/L2 address: 0x..."
            variant="filled"
            fullWidth
            required
            {...register('manager', {
              validate: {
                isManagerMember: (v) =>
                  contractReadManagerResult.isError || // if there was an RPC read error, use a different validation logic
                  (contractReadManagerResult.isSuccess && Number(contractReadManagerResult?.data) > 0) ||
                  'Manager must be an existing token holder.'
              }
            })}
          />
          {contractReadManagerResult.isLoading && <CircularProgress />}
        </ListItem>
        <ListItem>
          <ErrorMessage as={<Alert severity="error" />} errors={formErrors} name="manager" />
        </ListItem>
        {contractReadManagerResult.isError && (
          <ListItem>
            <Alert severity="error">{`Error verifying manager address: ${contractReadManagerResult.error}`}.</Alert>
          </ListItem>
        )}
        <ListItem>
          <TextField
            data-testid="budget"
            label="Budget"
            helperText="Amount in DAO sweat tokens"
            variant="filled"
            type="number"
            fullWidth
            {...register('budget', {
              required: true,
              validate: {
                positive: (v) => v > 0
              }
            })}
          />
        </ListItem>
        {formErrors.budget && (
          <ListItem>
            <Alert severity="error">Budget must be a positive number.</Alert>
          </ListItem>
        )}
        <ListItem>
          <TextField
            id="deadline"
            data-testid="deadline"
            label="Deadline"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            {...register('deadline', {
              required: 'Deadline is required.',
              validate: {
                future: (v) => new Date(v) > new Date() || 'Deadline must be in the future.'
              }
            })}
          />
        </ListItem>
        <ListItem>
          <ErrorMessage as={<Alert severity="error" />} errors={formErrors} name="deadline" />
        </ListItem>
        <ListItem>
          <TextField
            id="goalTitle"
            data-testid="goalTitle"
            label="Goal"
            helperText="Describe a measurable goal of the project"
            variant="filled"
            fullWidth
            {...register('goalTitle', { required: 'Goal title is required.' })}
          />
        </ListItem>
        <ListItem>
          <ErrorMessage as={<Alert severity="error" />} errors={formErrors} name="goalTitle" />
        </ListItem>
        <ListItem>
          <TextField
            id="goalLink"
            data-testid="goalLink"
            type="url"
            label="Goal Tracking Link"
            helperText="URL to project board where this goal is tracked."
            variant="filled"
            fullWidth
            {...register('goalLink')}
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Description"
            helperText="Describe the main goal(s) of this project using Markdown format."
            variant="filled"
            multiline
            fullWidth
            data-testid="goalDescription"
            minRows={5}
            {...register('goalDescription')}
          />
        </ListItem>
        {watchGoalDescription && (
          <>
            <ListItem>
              <Typography variant="caption">Markdown Preview</Typography>
            </ListItem>
            <ListItem>
              <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
                <ReactMarkdown skipHtml children={watchGoalDescription} />
              </Box>
            </ListItem>
          </>
        )}
        <ListItem>
          <Button
            type="submit"
            variant="contained"
            disabled={contractReadManagerResult.isLoading}
            data-testid="submit-button"
          >
            Submit
          </Button>
        </ListItem>
      </List>
      {dialogOpen && (
        <Web3SubmitDialog open={dialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess="./" />
      )}
    </Box>
  )
}
